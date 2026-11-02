import clsx from "clsx";
import { Button, composeRenderProps } from "react-aria-components";
import { DropdownMenuTriggerProps } from "./types";

/**
 * An unstyled trigger to wrap any content in, such as an avatar, exposed as
 * `DropdownMenu.Trigger`. It renders a `<button>`, so the trigger is focusable
 * and announced as a menu button whatever it contains. Style it through
 * `className` and the `data-hovered`, `data-pressed`, `data-focus-visible` and
 * `aria-expanded` attributes. Give it an `aria-label` when its content has no
 * text, and keep links, buttons and other interactive content out of it.
 */
export const DropdownMenuTrigger = ({
  className,
  ...props
}: DropdownMenuTriggerProps) => (
  <Button
    {...props}
    className={composeRenderProps(className, (className) =>
      clsx("c__dropdown-menu-trigger", className),
    )}
  />
);
