import jscodeshift from "jscodeshift";
import { mapSpecifier, PACKAGES, sourceIsEnabled } from "./mappings.js";

const parsers = {
  ".js": "babel",
  ".jsx": "babel",
  ".ts": "ts",
  ".tsx": "tsx",
};

const getExtension = (filePath) => {
  const match = filePath.match(/\.[^.]+$/);
  return match?.[0].toLowerCase() ?? ".js";
};

const issue = (issues, filePath, message, node) => {
  issues.push({
    filePath,
    line: node?.loc?.start?.line,
    message,
  });
};

const importedName = (specifier) => {
  if (specifier.type !== "ImportSpecifier") return undefined;
  return specifier.imported.type === "Identifier"
    ? specifier.imported.name
    : specifier.imported.value;
};

function splitUiKitImports(j, path, iconNames, issues, filePath) {
  const node = path.node;
  if (node.source.value !== "@gouvfr-lasuite/ui-kit") return false;
  if (node.specifiers.some((specifier) => specifier.type === "ImportNamespaceSpecifier")) {
    issue(issues, filePath, "Namespace import left unchanged; migrate its property accesses manually.", node);
    return false;
  }

  const iconSpecifiers = [];
  const componentSpecifiers = [];
  for (const specifier of node.specifiers) {
    if (iconNames.has(importedName(specifier))) iconSpecifiers.push(specifier);
    else componentSpecifiers.push(specifier);
  }

  if (iconSpecifiers.length === 0) {
    node.source.value = PACKAGES.components;
    return true;
  }

  const declarations = [];
  if (componentSpecifiers.length > 0) {
    const components = j.importDeclaration(componentSpecifiers, j.literal(PACKAGES.components));
    components.importKind = node.importKind;
    declarations.push(components);
  }
  const icons = j.importDeclaration(iconSpecifiers, j.literal(`${PACKAGES.components}/icons`));
  icons.importKind = node.importKind;
  declarations.push(icons);
  declarations[0].comments = node.comments;
  j(path).replaceWith(declarations);
  return true;
}

function splitUiKitReExports(j, path, iconNames) {
  const node = path.node;
  if (node.source?.value !== "@gouvfr-lasuite/ui-kit" || !node.specifiers) return false;
  const icons = [];
  const components = [];
  for (const specifier of node.specifiers) {
    const name = specifier.local?.name ?? specifier.local?.value;
    if (iconNames.has(name)) icons.push(specifier);
    else components.push(specifier);
  }
  if (icons.length === 0) {
    node.source.value = PACKAGES.components;
    return true;
  }
  const declarations = [];
  if (components.length > 0) {
    const componentExport = j.exportNamedDeclaration(null, components, j.literal(PACKAGES.components));
    componentExport.exportKind = node.exportKind;
    declarations.push(componentExport);
  }
  const iconExport = j.exportNamedDeclaration(null, icons, j.literal(`${PACKAGES.components}/icons`));
  iconExport.exportKind = node.exportKind;
  declarations.push(iconExport);
  declarations[0].comments = node.comments;
  j(path).replaceWith(declarations);
  return true;
}

export function transformJavaScript(sourceText, filePath, options) {
  const source = options.source ?? "all";
  const iconNames = new Set(options.iconNames ?? []);
  const issues = [];
  let changed = false;
  const parser = parsers[getExtension(filePath)] ?? "babel";
  const j = jscodeshift.withParser(parser);
  const root = j(sourceText);

  root.find(j.ImportDeclaration).forEach((path) => {
    const specifier = path.node.source.value;
    if (typeof specifier !== "string" || !sourceIsEnabled(specifier, source)) return;
    if (specifier === "@gouvfr-lasuite/ui-kit") {
      if (splitUiKitImports(j, path, iconNames, issues, filePath)) changed = true;
      return;
    }
    const mapped = mapSpecifier(specifier, source);
    if (mapped.kind === "mapped") {
      if (path.node.specifiers.some((item) => item.type === "ImportNamespaceSpecifier")) {
        issue(issues, filePath, "Namespace import left unchanged; migrate its property accesses manually.", path.node);
        return;
      }
      path.node.source.value = mapped.value;
      changed = true;
    } else if (mapped.kind === "unsupported") {
      issue(issues, filePath, `Internal or unsupported package path left unchanged: ${specifier}`, path.node);
    }
  });

  root.find(j.ExportNamedDeclaration).forEach((path) => {
    const specifier = path.node.source?.value;
    if (typeof specifier !== "string" || !sourceIsEnabled(specifier, source)) return;
    if (splitUiKitReExports(j, path, iconNames)) {
      changed = true;
      return;
    }
    const mapped = mapSpecifier(specifier, source);
    if (mapped.kind === "mapped") {
      path.node.source.value = mapped.value;
      changed = true;
    } else if (mapped.kind === "unsupported") {
      issue(issues, filePath, `Internal or unsupported package path left unchanged: ${specifier}`, path.node);
    }
  });

  root.find(j.ExportAllDeclaration).forEach((path) => {
    const specifier = path.node.source.value;
    if (typeof specifier !== "string" || !sourceIsEnabled(specifier, source)) return;
    const mapped = mapSpecifier(specifier, source);
    if (mapped.kind === "mapped") {
      path.node.source.value = mapped.value;
      changed = true;
    } else if (mapped.kind === "unsupported") {
      issue(issues, filePath, `Internal or unsupported package path left unchanged: ${specifier}`, path.node);
    }
  });

  root.find(j.CallExpression).forEach((path) => {
    const callee = path.node.callee;
    const isRequire = callee.type === "Identifier" && callee.name === "require";
    const isDynamicImport = callee.type === "Import";
    if (!isRequire && !isDynamicImport) return;
    const argument = path.node.arguments[0];
    if (!argument) return;
    if (argument.type !== "StringLiteral" && argument.type !== "Literal") {
      const rawArgument = j(argument).toSource();
      if (/gouvfr-lasuite\/(?:ui-kit|cunningham)/.test(rawArgument)) {
        issue(issues, filePath, "Dynamic package expression left unchanged.", path.node);
      }
      return;
    }
    const specifier = argument.value;
    if (typeof specifier !== "string" || !sourceIsEnabled(specifier, source)) return;
    const mapped = mapSpecifier(specifier, source);
    if (mapped.kind === "mapped") {
      argument.value = mapped.value;
      changed = true;
    } else if (mapped.kind === "unsupported") {
      issue(issues, filePath, `Internal or unsupported package path left unchanged: ${specifier}`, path.node);
    }
  });

  const output = changed ? root.toSource({ quote: "double", reuseWhitespace: true }) : sourceText;
  return { output, changed: output !== sourceText, issues };
}

export function transformStyles(sourceText, filePath, options = {}) {
  const issues = [];
  const source = options.source ?? "all";
  let changed = false;
  const output = sourceText.replace(
    /(@(?:use|import)\s+(?:url\()?\s*["'])(@gouvfr-lasuite\/(?:ui-kit|cunningham-react|cunningham-tokens)(?:\/[^"')\s;]+)?)(["'])/g,
    (match, prefix, specifier, suffix, offset) => {
      const mapped = mapSpecifier(specifier, source);
      if (mapped.kind === "mapped") {
        changed = true;
        return `${prefix}${mapped.value}${suffix}`;
      }
      if (mapped.kind === "unsupported") {
        issues.push({ filePath, line: sourceText.slice(0, offset).split("\n").length, message: `Internal or unsupported package path left unchanged: ${specifier}` });
      }
      return match;
    },
  );
  return { output, changed, issues };
}

export function transformPackageJson(sourceText, filePath, options = {}) {
  const source = options.source ?? "all";
  const issues = [];
  let json;
  try {
    json = JSON.parse(sourceText);
  } catch (error) {
    return { output: sourceText, changed: false, issues: [{ filePath, message: `Invalid package.json: ${error.message}` }] };
  }

  let changed = false;
  for (const section of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies", "resolutions"]) {
    const dependencies = json[section];
    if (!dependencies || typeof dependencies !== "object") continue;
    for (const [oldName, newName] of Object.entries({
      "@gouvfr-lasuite/cunningham-react": PACKAGES.components,
      "@gouvfr-lasuite/cunningham-tokens": PACKAGES.tokens,
      "@gouvfr-lasuite/ui-kit": PACKAGES.components,
    })) {
      if (!sourceIsEnabled(oldName, source) || !(oldName in dependencies)) continue;
      if (!(newName in dependencies)) dependencies[newName] = "^1.0.0";
      delete dependencies[oldName];
      changed = true;
    }
  }

  return {
    output: changed ? `${JSON.stringify(json, null, 2)}\n` : sourceText,
    changed,
    issues,
  };
}
