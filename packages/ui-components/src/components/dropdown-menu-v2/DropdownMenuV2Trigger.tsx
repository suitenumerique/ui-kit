import {
  Children,
  cloneElement,
  DOMAttributes,
  isValidElement,
  ReactElement,
  ReactNode,
} from "react";
import {
  Button as AriaButton,
  Link as AriaLink,
  MenuTrigger,
  Pressable,
  ToggleButton as AriaToggleButton,
} from "react-aria-components";
import { Button } from ":/components/button";
import { DropdownMenuV2TriggerProps } from "./types";

/**
 * React Aria components that already consume the menu trigger press context.
 * Wrapping them in `Pressable` would register the press twice and toggle the
 * menu open then closed.
 */
const ARIA_PRESSABLES: unknown[] = [AriaButton, AriaLink, AriaToggleButton];

type TriggerElementProps = {
  type?: string;
  href?: string;
  disabled?: boolean;
  "aria-disabled"?: boolean | "true" | "false";
};

/** Keeps a button trigger from submitting the form it sits in. */
const withButtonType = (element: ReactElement<TriggerElementProps>) => {
  const isButton =
    element.type === "button" || (element.type === Button && !element.props.href);
  return isButton && element.props.type === undefined
    ? cloneElement(element, { type: "button" })
    : element;
};

const toPressable = (trigger: ReactNode) => {
  if (!isValidElement<TriggerElementProps>(trigger)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "DropdownMenuV2: the trigger must be a single element forwarding its ref and props to a focusable DOM element.",
      );
    }
    return trigger;
  }

  if (ARIA_PRESSABLES.includes(trigger.type)) {
    return trigger;
  }

  const { disabled, "aria-disabled": ariaDisabled } = trigger.props;
  return (
    <Pressable
      isDisabled={!!disabled || ariaDisabled === true || ariaDisabled === "true"}
    >
      {withButtonType(trigger) as ReactElement<DOMAttributes<Element>, string>}
    </Pressable>
  );
};

/**
 * Wires any trigger element to a menu. Its first child is the trigger, which
 * receives `aria-haspopup`, `aria-expanded`, `aria-controls`, the press and
 * keyboard handlers and a ref; the second child is a `DropdownMenuV2Popover`.
 * The open state is uncontrolled unless `isOpen` is set.
 */
export const DropdownMenuV2Trigger = ({
  children,
  ...props
}: DropdownMenuV2TriggerProps) => {
  const [trigger, ...rest] = Children.toArray(children);
  return (
    <MenuTrigger {...props}>
      {toPressable(trigger)}
      {rest}
    </MenuTrigger>
  );
};
