import {
  Children,
  cloneElement,
  DOMAttributes,
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from "react";
import {
  Button as AriaButton,
  Link as AriaLink,
  MenuTrigger,
  Pressable,
  ToggleButton as AriaToggleButton,
} from "react-aria-components";
import { Button } from ":/components/button";
import { Tooltip } from ":/components/tooltip";
import { DropdownMenuTrigger } from "./DropdownMenuTrigger";
import { DropdownMenuRootProps } from "./types";

/**
 * Components that already consume the menu trigger press context, as React
 * Aria buttons and links do. Wrapping them in `Pressable` would make a second
 * press handler consume the same context.
 */
const ARIA_PRESSABLES: unknown[] = [
  AriaButton,
  AriaLink,
  AriaToggleButton,
  DropdownMenuTrigger,
];

type TriggerElementProps = {
  type?: string;
  href?: string;
  disabled?: boolean;
  isDisabled?: boolean;
  "aria-disabled"?: boolean | "true" | "false";
  children?: ReactNode;
};

/** The element that renders the trigger, looking through a wrapping Tooltip. */
const renderedElement = (element: ReactElement<TriggerElementProps>) => {
  if (element.type === Tooltip) {
    const [child] = Children.toArray(element.props.children);
    if (isValidElement<TriggerElementProps>(child)) {
      return child;
    }
  }
  return element;
};

const isTriggerDisabled = (trigger: ReactNode) => {
  if (!isValidElement<TriggerElementProps>(trigger)) {
    return false;
  }
  const {
    disabled,
    isDisabled,
    "aria-disabled": ariaDisabled,
  } = renderedElement(trigger).props;
  return (
    !!disabled || !!isDisabled || ariaDisabled === true || ariaDisabled === "true"
  );
};

/**
 * Keeps a button trigger from submitting the form it sits in. A Tooltip
 * forwards the type to the button it wraps.
 */
const withButtonType = (element: ReactElement<TriggerElementProps>) => {
  const rendered = renderedElement(element);
  const isButton =
    rendered.type === "button" ||
    (rendered.type === Button && !rendered.props.href);
  return isButton && rendered.props.type === undefined
    ? cloneElement(element, { type: "button" })
    : element;
};

const toPressable = (trigger: ReactNode, isDisabled: boolean) => {
  if (!isValidElement<TriggerElementProps>(trigger)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "DropdownMenu: the trigger must be a single element forwarding its ref and props to a focusable DOM element.",
      );
    }
    return trigger;
  }

  if (ARIA_PRESSABLES.includes(trigger.type)) {
    return trigger;
  }

  return (
    <Pressable isDisabled={isDisabled}>
      {withButtonType(trigger) as ReactElement<DOMAttributes<Element>, string>}
    </Pressable>
  );
};

/**
 * Wires any trigger element to a menu. Its first child is the trigger, which
 * receives `aria-haspopup`, `aria-expanded`, `aria-controls`, the press and
 * keyboard handlers and a ref; the second child is a `DropdownMenu.Popover`.
 * The open state is uncontrolled unless `isOpen` is set.
 */
export const DropdownMenuRoot = ({
  children,
  isOpen: isOpenProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: DropdownMenuRootProps) => {
  const [trigger, ...rest] = Children.toArray(children);
  const isDisabled = isTriggerDisabled(trigger);

  // MenuTrigger always gets a controlled state: switching it to controlled
  // only while the trigger is disabled would bring back its previous state,
  // and the menu, once the trigger is enabled again.
  const [ownIsOpen, setOwnIsOpen] = useState(defaultOpen);
  const isOpen = isOpenProp ?? ownIsOpen;

  // A trigger disabled while its menu is open closes the menu for good.
  useEffect(() => {
    if (isDisabled && isOpen) {
      setOwnIsOpen(false);
      onOpenChange?.(false);
    }
  }, [isDisabled, isOpen, onOpenChange]);

  return (
    <MenuTrigger
      {...props}
      isOpen={isOpen && !isDisabled}
      onOpenChange={(nextIsOpen) => {
        // The menu trigger keyboard handler opens the menu on Enter or arrow
        // keys whatever the press state, so a disabled trigger that stays
        // focusable (`aria-disabled`) would still open it.
        if (nextIsOpen && isDisabled) {
          return;
        }
        setOwnIsOpen(nextIsOpen);
        onOpenChange?.(nextIsOpen);
      }}
    >
      {toPressable(trigger, isDisabled)}
      {rest}
    </MenuTrigger>
  );
};
