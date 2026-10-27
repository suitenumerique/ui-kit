import clsx from "clsx";
import { Collection, Header, MenuSection } from "react-aria-components";
import { DropdownMenuSectionProps } from "./types";

/**
 * Groups items of a DropdownMenu. A `title` renders a heading that names the
 * group; without it, pass an `aria-label`. A section can carry its own
 * `selectionMode` and `selectedKeys`.
 */
export const DropdownMenuSection = <T extends object>({
  title,
  className,
  children,
  items,
  ...props
}: DropdownMenuSectionProps<T>) => (
  <MenuSection
    {...props}
    className={clsx("c__dropdown-menu-section", className)}
  >
    {title && <Header className="c__dropdown-menu-section__title">{title}</Header>}
    <Collection items={items}>{children}</Collection>
  </MenuSection>
);
