import jscodeshift from "jscodeshift";
import { parserFor } from "./transform.js";

// Packages exporting DropdownMenu, MenuItemBody and the Button and Tooltip
// they are used with, under their former names too: the audit runs before or
// after the package migration.
const UI_PACKAGES = new Set([
  "@gouvfr-lasuite/ui-components",
  "@gouvfr-lasuite/ui-kit",
  "@gouvfr-lasuite/cunningham-react",
  "@openfun/cunningham-react",
]);
const ARIA_PACKAGE = "react-aria-components";

// Components rendering a focusable element with an interactive role, which
// forward the props and ref of the menu button to it.
const BUTTONS = new Set([
  "ui:DropdownMenu.Trigger",
  "ui:DropdownMenuTrigger",
  "ui:Button",
  "aria:Button",
  "aria:Link",
  "aria:ToggleButton",
]);

const NATIVE_CONTROLS = new Set(["button", "input", "select", "textarea", "summary"]);

// The widget roles React Aria's Pressable accepts on a trigger.
const INTERACTIVE_ROLES = new Set([
  "application", "button", "checkbox", "combobox", "gridcell", "link",
  "menuitem", "menuitemcheckbox", "menuitemradio", "option", "radio",
  "searchbox", "separator", "slider", "spinbutton", "switch", "tab",
  "textbox", "treeitem",
]);

// React Aria components whose text slots have no `label`: a MenuItemBody
// rendered inside them throws `Invalid slot "label"` without
// `withSlots={false}`.
const SLOTS_WITHOUT_LABEL = new Set(
  [
    "Calendar", "Checkbox", "ColorField", "ComboBox", "DateField", "DatePicker",
    "DateRangePicker", "GridListItem", "NumberField", "RadioGroup",
    "RangeCalendar", "SearchField", "Select", "TagGroup", "TextField", "TimeField",
  ].map((name) => `aria:${name}`),
);
// Items defining their own `label` slot, popovers, which clear the slots of
// the field they open from, and SelectValue, which clears those of its Select.
const SLOT_BOUNDARIES = new Set([
  "aria:ListBoxItem",
  "aria:MenuItem",
  "aria:Popover",
  "aria:SelectValue",
  "ui:DropdownMenu.Item",
]);

// Classes the previous DropdownMenu rendered, with their closest successor.
const REMOVED_CLASSES = new Map([
  ["c__dropdown-menu--root", "c__dropdown-menu"],
  ["c__dropdown-menu-item__label-container", "c__dropdown-menu-item__content"],
  ["c__dropdown-menu-item__label-subtext", "c__dropdown-menu-item__description"],
  ["c__dropdown-menu-item-top-message", "c__dropdown-menu__message--top"],
  ["c__dropdown-menu-item-bottom-message", "c__dropdown-menu__message--bottom"],
]);
const TRIGGER_CLASS = "c__dropdown-menu-trigger";
const CLASS_PATTERN = new RegExp(
  `(${[...REMOVED_CLASSES.keys(), TRIGGER_CLASS].join("|")})(?![\\w-])`,
  "g",
);

const NO_TRIGGER = "The menu has no trigger in this branch: render the whole `DropdownMenu` conditionally instead.";
const TEXT_TRIGGER = "The trigger is plain text: wrap it in `DropdownMenu.Trigger` or use a `Button`.";

const lineAt = (sourceText, offset) => sourceText.slice(0, offset).split("\n").length;

function auditClassNames(sourceText, filePath) {
  return Array.from(sourceText.matchAll(CLASS_PATTERN), (match) => ({
    filePath,
    line: lineAt(sourceText, match.index),
    level: "warning",
    message: match[1] === TRIGGER_CLASS
      ? `\`${TRIGGER_CLASS}\` no longer wraps every trigger: only \`DropdownMenu.Trigger\` renders it. Move these styles to the trigger's own class.`
      : `\`${match[1]}\` is no longer rendered. The closest class is \`${REMOVED_CLASSES.get(match[1])}\`, but the menu markup changed: check the rule still applies.`,
  }));
}

const isStringLiteral = (node) =>
  node.type === "StringLiteral" || (node.type === "Literal" && typeof node.value === "string");

const isEmptyValue = (node) =>
  node.type === "NullLiteral" ||
  (node.type === "Literal" && node.value === null) ||
  (node.type === "Identifier" && node.name === "undefined");

const isCall = (node) => /CallExpression$/.test(node.type);

const propertyName = (property) =>
  property.type === "SpreadElement" || property.computed
    ? undefined
    : property.key.name ?? property.key.value;

const isFunction = (node) =>
  node?.type === "ArrowFunctionExpression" || node?.type === "FunctionExpression";

function collectImports(root, j) {
  const bindings = new Map();
  const namespaces = new Map();
  root.find(j.ImportDeclaration).forEach((path) => {
    const source = path.node.source.value;
    const prefix = UI_PACKAGES.has(source) ? "ui" : source === ARIA_PACKAGE ? "aria" : undefined;
    if (!prefix) return;
    for (const specifier of path.node.specifiers ?? []) {
      if (specifier.type === "ImportNamespaceSpecifier") {
        namespaces.set(specifier.local.name, prefix);
      } else if (specifier.type === "ImportSpecifier") {
        const imported = specifier.imported.name ?? specifier.imported.value;
        bindings.set(specifier.local.name, `${prefix}:${imported}`);
      }
    }
  });
  return { bindings, namespaces };
}

const memberParts = (name) =>
  name.type === "JSXMemberExpression"
    ? [...memberParts(name.object), name.property.name]
    : [name.name];

const meaningfulChildren = (children = []) =>
  children.filter((child) =>
    !(child.type === "JSXText" && child.value.trim() === "") &&
    !(child.type === "JSXExpressionContainer" && child.expression.type === "JSXEmptyExpression"));

function readAttributes(element) {
  const attributes = new Map();
  let hasSpread = false;
  for (const attribute of element.openingElement.attributes) {
    if (attribute.type === "JSXSpreadAttribute") hasSpread = true;
    else attributes.set(attribute.name.name, attribute);
  }
  return { attributes, hasSpread };
}

const attributeExpression = (attribute) =>
  attribute?.value?.type === "JSXExpressionContainer" ? attribute.value.expression : attribute?.value;

/**
 * Reports the DropdownMenu triggers, MenuItemBody slots and former menu
 * classes that need a manual update. A finding is an `error` when the code
 * breaks with the rebuilt menu, and a `warning` when it needs a check.
 */
export function auditDropdownMenu(sourceText, filePath) {
  const findings = auditClassNames(sourceText, filePath);
  if (/\.(?:css|scss|sass)$/.test(filePath) || !/DropdownMenu|MenuItemBody/.test(sourceText)) {
    return findings;
  }

  const j = jscodeshift.withParser(parserFor(filePath));
  let root;
  try {
    root = j(sourceText);
  } catch (error) {
    findings.push({ filePath, level: "warning", message: `Could not parse the file: ${error.message}` });
    return findings;
  }
  const imports = collectImports(root, j);
  if (imports.bindings.size === 0 && imports.namespaces.size === 0) return findings;

  const text = (node) =>
    typeof node.start === "number" ? sourceText.slice(node.start, node.end) : j(node).toSource();
  const report = (level, node, message) =>
    findings.push({ filePath, line: node.loc?.start.line, level, message });
  // `find` skips the node it starts from.
  const nodesIn = (node, test) => [node, ...j(node).find(j.Node).nodes()].filter(test);
  const hasDescendant = (node, type, test) => j(node).find(type).filter(test).size() > 0;

  /**
   * Resolves a JSX tag to `{ tag }` for a DOM element, or to `{ component }`
   * (such as `ui:DropdownMenu.Trigger`) for a component imported from a known
   * package. `label` is the tag as written.
   */
  function resolve(element) {
    const name = element.openingElement.name;
    const label = text(name);
    if (name.type === "JSXIdentifier" && /^[a-z]/.test(name.name)) return { tag: name.name, label };
    if (name.type === "JSXNamespacedName") return { label };
    const [head, ...rest] = memberParts(name);
    let component = imports.bindings.get(head);
    if (!component && imports.namespaces.has(head) && rest.length > 0) {
      component = `${imports.namespaces.get(head)}:${rest.shift()}`;
    }
    if (component && rest.length > 0) component = `${component}.${rest.join(".")}`;
    return { component, label };
  }

  // A handler written inline, or bound in its scope to a function, possibly
  // wrapped in a `useCallback`.
  function findFunction(expression) {
    if (isFunction(expression)) return expression;
    if (expression?.type !== "Identifier") return undefined;
    const [path] = root.find(j.Identifier).filter((candidate) => candidate.node === expression).paths();
    const [binding] = path?.scope?.lookup(expression.name)?.getBindings()[expression.name] ?? [];
    const declaration = binding?.parent.node;
    if (declaration?.type === "FunctionDeclaration") return declaration;
    const init = declaration?.type === "VariableDeclarator" ? declaration.init : undefined;
    if (isFunction(init)) return init;
    return init && isCall(init) && isFunction(init.arguments[0]) ? init.arguments[0] : undefined;
  }

  // `isOpen` in `menu.isOpen` or `{ isOpen: true }` does not read the state.
  const isPropertyName = (path) => {
    const parent = path.parent?.node;
    return !!parent && !parent.computed &&
      (parent.property === path.node || (/Property$/.test(parent.type) && parent.key === path.node));
  };

  /**
   * The open state of a controlled menu: `isToggle` tells the calls changing
   * it, as in `setIsOpen(!isOpen)` or a call to the `onOpenChange` setter, and
   * `isStateTest` the conditions on the state itself.
   */
  function readOpenState(menu) {
    const { attributes } = readAttributes(menu);
    const isOpen = attributeExpression(attributes.get("isOpen"));
    const onOpenChange = attributeExpression(attributes.get("onOpenChange"));
    const setters = new Set();
    if (isFunction(onOpenChange)) {
      // In `(next) => { setOpen(next); track("menu", next); }`, the setter is
      // the call given the new state first.
      const [param] = onOpenChange.params;
      for (const call of nodesIn(onOpenChange.body, isCall)) {
        const [argument] = call.arguments;
        if (param?.type === "Identifier" && argument?.type === "Identifier" && argument.name === param.name) {
          setters.add(text(call.callee));
        }
      }
    } else if (onOpenChange) setters.add(text(onOpenChange));
    if (!isOpen && setters.size === 0) return undefined;

    const isState = (node) =>
      !!isOpen &&
      /^(?:Identifier|ChainExpression|(?:Optional)?MemberExpression)$/.test(node.type) &&
      text(node) === text(isOpen);
    const readsState = (node) =>
      isState(node) ||
      j(node).find(j.Node).filter((path) => isState(path.node) && !isPropertyName(path)).size() > 0;
    return {
      isToggle: (call) => setters.has(text(call.callee)) || call.arguments.some(readsState),
      // `isOpen ? close() : open()` only picks the direction of a toggle.
      isStateTest: (node) =>
        isState(node.type === "UnaryExpression" && node.operator === "!" ? node.argument : node),
    };
  }

  // A condition other than the open state stands between the handler and the
  // call.
  const isGuarded = (path, boundary, state) => {
    for (let child = path, parent = path.parent; parent && child.node !== boundary; child = parent, parent = parent.parent) {
      const { node } = parent;
      const isBranch =
        ((node.type === "IfStatement" || node.type === "ConditionalExpression") && child.node !== node.test) ||
        (node.type === "LogicalExpression" && child.node === node.right);
      if (isBranch && !state.isStateTest(node.type === "LogicalExpression" ? node.left : node.test)) return true;
    }
    return false;
  };

  // `if (!canUpdate) return;` before the call.
  const followsEarlyReturn = (fn, call, state) =>
    fn.body.type === "BlockStatement" &&
    fn.body.body.some((statement) =>
      statement.type === "IfStatement" &&
      statement.start < call.start &&
      !state.isStateTest(statement.test) &&
      nodesIn(statement.consequent, (node) => node.type === "ReturnStatement").length > 0);

  /**
   * Reports an `onClick` that toggled the previous menu under a condition: the
   * menu now opens on press by itself, so the condition no longer applies.
   */
  function auditToggle(trigger, state) {
    if (!state) return;
    const { attributes } = readAttributes(trigger);
    const handler = attributes.get("onClick") ?? attributes.get("onPress");
    const expression = attributeExpression(handler);
    if (!expression) return;

    // `canUpdate ? toggle : undefined` and `canUpdate && toggle` guard the
    // whole handler.
    const { guard, functions } =
      expression.type === "ConditionalExpression"
        ? { guard: expression.test, functions: [expression.consequent, expression.alternate] }
        : expression.type === "LogicalExpression"
          ? { guard: expression.left, functions: [expression.right] }
          : { functions: [expression] };
    const isGuardedHandler = !!guard && !state.isStateTest(guard);
    let isGuardedToggle = false;
    for (const fn of functions.map(findFunction).filter(Boolean)) {
      const toggles = nodesIn(fn.body, (node) => isCall(node) && state.isToggle(node));
      if (toggles.length > 0 && isGuardedHandler) isGuardedToggle = true;
      j(fn.body).find(j.Node).filter((path) => toggles.includes(path.node)).forEach((path) => {
        if (isGuarded(path, fn.body, state) || followsEarlyReturn(fn, path.node, state)) isGuardedToggle = true;
      });
    }
    if (!isGuardedToggle) return;
    const isDisabled = ["disabled", "isDisabled", "aria-disabled"].some((name) => attributes.has(name));
    report(
      isDisabled ? "warning" : "error",
      handler,
      "The trigger's `onClick` only opens the menu under a condition, but the menu now opens on press by itself. Disable the trigger (`disabled`, `isDisabled`) or render the menu only when that condition holds, then remove the toggle.",
    );
  }

  // Text content, a translated label (`{t("…")}`) or an `alt` can name the
  // trigger.
  const containsText = (node) =>
    node.type === "JSXText" ||
    node.type === "JSXExpressionContainer" ||
    hasDescendant(node, j.JSXText, (path) => path.node.value.trim() !== "") ||
    hasDescendant(node, j.JSXExpressionContainer, (path) =>
      path.parent.node.type !== "JSXAttribute" && path.node.expression.type !== "JSXEmptyExpression") ||
    hasDescendant(node, j.JSXAttribute, (path) => ["alt", "aria-label", "title"].includes(path.node.name.name));

  // A missing name predates the rebuilt menu: it is a warning, not a breakage.
  function auditName(trigger, label) {
    const { attributes, hasSpread } = readAttributes(trigger);
    const namingProps = ["aria-label", "aria-labelledby", "title", "children", "value"];
    if (hasSpread || namingProps.some((name) => attributes.has(name))) return;
    const children = meaningfulChildren(trigger.children);
    if (children.length === 0) {
      report("warning", trigger, `\`<${label}>\` has no content and no \`aria-label\`: the menu button has no accessible name.`);
    } else if (!children.some(containsText)) {
      report("warning", trigger, `\`<${label}>\` may have no accessible name: it contains no text. Add an \`aria-label\`.`);
    }
  }

  const findInteractiveDescendant = (element) =>
    j(element).find(j.JSXElement).nodes().find((node) => {
      const { tag, component } = resolve(node);
      return tag ? NATIVE_CONTROLS.has(tag) || tag === "a" : BUTTONS.has(component);
    });

  function auditDomTrigger(element, tag, label, state) {
    const { attributes, hasSpread } = readAttributes(element);
    auditToggle(element, state);
    if (NATIVE_CONTROLS.has(tag) || (tag === "a" && attributes.has("href"))) {
      auditName(element, label);
      return;
    }
    const role = attributeExpression(attributes.get("role"));
    const hasRole = role && isStringLiteral(role) ? INTERACTIVE_ROLES.has(role.value) : !!role || hasSpread;
    const isFocusable = attributes.has("tabIndex") || hasSpread;
    if (hasRole && isFocusable) {
      if (hasSpread) {
        report("warning", element, `Check that the props spread on \`<${label}>\` give it an interactive \`role\` and a \`tabIndex\`, or use \`DropdownMenu.Trigger\`.`);
      }
      auditName(element, label);
      return;
    }

    const wrapped = findInteractiveDescendant(element);
    if (wrapped) {
      const wrappedLabel = resolve(wrapped).label;
      report("error", element, `The trigger is a \`<${label}>\` wrapping \`<${wrappedLabel}>\`: pass \`<${wrappedLabel}>\` itself as the child. The menu sets its ref, ARIA attributes and handlers on the child.`);
    } else if (!role && !isFocusable) {
      report("error", element, `The trigger is a \`<${label}>\`, which is neither focusable nor a button. Wrap its content in \`DropdownMenu.Trigger\` (with an \`aria-label\` when it has no text), or use a \`Button\`.`);
    } else if (!isFocusable) {
      report("error", element, `\`<${label}>\` is not focusable: add \`tabIndex={0}\`, or use \`DropdownMenu.Trigger\`.`);
    } else {
      report("error", element, `\`<${label}>\` has no interactive role: add \`role="button"\`, or use \`DropdownMenu.Trigger\`.`);
    }
  }

  function auditTriggerElement(element, state) {
    const { tag, component, label } = resolve(element);
    if (tag) {
      auditDomTrigger(element, tag, label, state);
      return;
    }
    if (component === "ui:Tooltip") {
      // The Tooltip forwards the menu button props to the element it wraps.
      const [child] = meaningfulChildren(element.children);
      if (child) auditTrigger(child, state);
      return;
    }
    auditToggle(element, state);
    if (BUTTONS.has(component)) {
      auditName(element, label);
      return;
    }
    report("warning", element, `Check once that \`<${label}>\` forwards its ref and props to a focusable element with an interactive role, such as a \`<button>\`, or wrap its content in \`DropdownMenu.Trigger\`. In development, React Aria logs "<Pressable> child must…" when it does not.`);
  }

  function auditTrigger(node, state) {
    if (node.type === "JSXExpressionContainer" || node.type === "ParenthesizedExpression") {
      auditTrigger(node.expression, state);
    } else if (node.type === "JSXElement") {
      auditTriggerElement(node, state);
    } else if (node.type === "ConditionalExpression") {
      auditTrigger(node.consequent, state);
      auditTrigger(node.alternate, state);
    } else if (node.type === "JSXFragment") {
      report("error", node, "The trigger is a fragment, which cannot receive the ref and props of the menu button: pass the trigger element itself.");
    } else if (node.type === "LogicalExpression" && node.operator === "&&") {
      report("error", node, "The trigger is conditional (`&&`): the menu has no trigger when the condition fails. Render the whole `DropdownMenu` conditionally, or disable the trigger.");
    } else if (node.type === "LogicalExpression") {
      // `trigger ?? <Button />` and `children || <Button />` fall back to an element.
      auditTrigger(node.left, state);
      auditTrigger(node.right, state);
    } else if (isEmptyValue(node)) {
      report("error", node, NO_TRIGGER);
    } else if (node.type === "JSXText" || isStringLiteral(node) || node.type === "TemplateLiteral") {
      report("error", node, TEXT_TRIGGER);
    } else if (isCall(node) && node.callee.property?.name === "map") {
      report("error", node, "The trigger is a list: `DropdownMenu` takes a single trigger element.");
    } else {
      report("warning", node, `The trigger \`${text(node)}\` cannot be checked statically: make sure it is a single element forwarding its ref and props to a focusable element with an interactive role.`);
    }
  }

  // The option objects of an `options` value written in the file: an array,
  // its spread and conditional parts, a variable or a `useMemo`, and the
  // `children` of submenus.
  function optionObjects(node, depth = 0) {
    if (!node || depth > 8) return [];
    const next = (child) => optionObjects(child, depth + 1);
    switch (node.type) {
      case "ArrayExpression":
        return node.elements.filter(Boolean).flatMap((element) => {
          if (element.type === "SpreadElement") return next(element.argument);
          if (element.type !== "ObjectExpression") return [];
          const children = element.properties.find((property) => propertyName(property) === "children");
          return [element, ...next(children?.value)];
        });
      case "ConditionalExpression":
        return [...next(node.consequent), ...next(node.alternate)];
      case "LogicalExpression":
        return [...next(node.left), ...next(node.right)];
      case "ParenthesizedExpression":
      case "TSAsExpression":
      case "TSSatisfiesExpression":
        return next(node.expression);
      case "Identifier":
        return root.find(j.VariableDeclarator, { id: { name: node.name } }).nodes()
          .flatMap((declarator) => next(declarator.init));
      default:
        break;
    }
    if (isCall(node) && isFunction(node.arguments[0])) {
      const { body } = node.arguments[0];
      return body.type === "BlockStatement"
        ? j(body).find(j.ReturnStatement).nodes().flatMap((statement) => next(statement.argument))
        : next(body);
    }
    return [];
  }

  // Without `selectedValues` nor `onSelectValue`, a `value` only turns a plain
  // action into a radio item.
  function auditOptionValues(menu) {
    const { attributes } = readAttributes(menu);
    if (attributes.has("selectedValues") || attributes.has("onSelectValue")) return;
    for (const option of optionObjects(attributeExpression(attributes.get("options")))) {
      const value = option.properties.find((property) => propertyName(property) === "value");
      if (!value) continue;
      report("warning", value, "This option has a `value`, but the menu has no `selectedValues` nor `onSelectValue`: it is now exposed as a radio item (`menuitemradio`). Remove `value` from plain actions.");
    }
  }

  // `DropdownMenu.Root` takes the trigger, then the popover.
  function auditMenu(menu, isRoot) {
    if (!isRoot) auditOptionValues(menu);
    const children = meaningfulChildren(menu.children);
    const { attributes, hasSpread } = readAttributes(menu);
    const trigger = children[0] ?? attributeExpression(attributes.get("children"));
    if (!trigger && hasSpread) {
      report("warning", menu, "The trigger comes from spread props and cannot be checked statically: make sure it is a single element forwarding its ref and props to a focusable element with an interactive role.");
    } else if (!trigger) {
      report("error", menu, "`DropdownMenu` has no trigger: pass the trigger element as its child.");
    } else if (!isRoot && children.length > 1) {
      report("error", children[1], "`DropdownMenu` takes a single child, its trigger. Group the content in `DropdownMenu.Trigger` or a `Button`.");
    } else {
      auditTrigger(trigger, readOpenState(menu));
    }
  }

  function auditMenuItemBody(path) {
    const { attributes, hasSpread } = readAttributes(path.node);
    const withSlots = attributes.get("withSlots");
    // `withSlots` alone means true; any other value turns the slots off or
    // cannot be read statically.
    if (withSlots?.value && attributeExpression(withSlots).value !== true) return;
    for (let parent = path.parent; parent; parent = parent.parent) {
      if (parent.node.type !== "JSXElement") continue;
      const { component, label } = resolve(parent.node);
      if (SLOT_BOUNDARIES.has(component)) return;
      if (SLOTS_WITHOUT_LABEL.has(component)) {
        report(hasSpread ? "warning" : "error", path.node, `\`MenuItemBody\` inside \`<${label}>\` needs \`withSlots={false}\`: React Aria throws \`Invalid slot "label"\` there.`);
        return;
      }
    }
  }

  root.find(j.JSXElement).forEach((path) => {
    const { component } = resolve(path.node);
    if (component === "ui:DropdownMenu") auditMenu(path.node, false);
    else if (component === "ui:DropdownMenu.Root") auditMenu(path.node, true);
    else if (component === "ui:MenuItemBody") auditMenuItemBody(path);
  });

  return findings.sort((a, b) => (a.line ?? 0) - (b.line ?? 0));
}
