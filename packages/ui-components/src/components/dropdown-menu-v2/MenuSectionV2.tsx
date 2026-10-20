import clsx from "clsx";
import { Collection, Header, MenuSection } from "react-aria-components";
import { MenuSectionV2Props } from "./types";

/**
 * Groups items of a DropdownMenuV2. A `title` renders a heading that names the
 * group; without it, pass an `aria-label`. A section can carry its own
 * `selectionMode` and `selectedKeys`.
 */
export const MenuSectionV2 = <T extends object>({
  title,
  className,
  children,
  items,
  ...props
}: MenuSectionV2Props<T>) => (
  <MenuSection
    {...props}
    className={clsx("c__menu-v2-section", className)}
  >
    {title && <Header className="c__menu-v2-section__title">{title}</Header>}
    <Collection items={items}>{children}</Collection>
  </MenuSection>
);
