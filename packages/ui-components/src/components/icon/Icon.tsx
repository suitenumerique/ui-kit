import React, { CSSProperties } from "react";
import clsx from "clsx";
import { IconSvgProps } from "./IconSvg";
import { ErrorFilled } from "./icons/ErrorFilled";
import { House } from "./icons/House";
import { Link } from "./icons/Link";
import { More } from "./icons/More";
import { Shared } from "./icons/Shared";
import { Zoom } from "./icons/Zoom";
import { IconSize, IconType } from "./types";

/**
 * Material names that already have an exported SVG.
 * `language`, `feedback`, `mark_email_read` and `public` stay on the
 * Material font until those glyphs are checked in Figma.
 * `arrow_drop_up` has no exported glyph.
 */
const materialSvg: Record<string, React.ComponentType<IconSvgProps>> = {
  home: House,
  search: Zoom,
  link: Link,
  more_horiz: More,
  error: ErrorFilled,
  people: Shared,
};

export type IconProps = {
  /**
   * The name of the Material Icon to display
   */
  name: string;

  /**
   * The type of the icon
   */
  type?: IconType;

  /**
   * The size of the icon
   */
  size?: IconSize | number;
  /**
   * Custom CSS class name
   */
  className?: string;
  /**
   * Custom color for the icon
   */
  color?: string;

  /**
   * Additional props to pass to the span element
   */
  [key: string]: unknown;
};

const hiddenFromName = (
  ariaHidden: unknown,
  ariaLabel: unknown,
  ariaLabelledBy: unknown,
) => {
  if (ariaHidden !== undefined) {
    return ariaHidden;
  }
  // A name on the icon itself must stay exposed. Otherwise the ligature
  // text ("close", "search", …) leaks into the accessible name.
  if (ariaLabel != null || ariaLabelledBy != null) {
    return undefined;
  }
  return true;
};

export const Icon: React.FC<IconProps> = ({
  name,
  size,
  className,
  color,
  type = IconType.FILLED,
  ...props
}) => {
  const ariaHidden = hiddenFromName(
    props["aria-hidden"],
    props["aria-label"],
    props["aria-labelledby"],
  );
  const { style: styleProp, ...rest } = props as {
    style?: CSSProperties;
    [key: string]: unknown;
  };
  delete rest["aria-hidden"];

  const SvgIcon = materialSvg[name];
  if (SvgIcon) {
    return (
      <SvgIcon
        {...(rest as IconSvgProps)}
        // Without an explicit size the glyph follows the font-size, same as
        // the Material ligature (24px, or 16px in a small/nano button).
        size={size}
        className={clsx(size === undefined && "c__icon", className)}
        style={{
          ...(color ? { color } : null),
          ...styleProp,
        }}
        aria-hidden={ariaHidden as IconSvgProps["aria-hidden"]}
      />
    );
  }

  const iconClasses = clsx(
    "material-icons",
    {
      [`icon--${size}`]: size !== undefined,
      [`icon--${type}`]: type !== IconType.OUTLINED,
    },
    className,
  );

  const style: CSSProperties = {
    color,
    fontSize: typeof size === "number" ? `${size}px` : undefined,
    ...styleProp,
  };

  return (
    <span
      className={iconClasses}
      style={style}
      {...rest}
      aria-hidden={ariaHidden as boolean | "true" | "false" | undefined}
    >
      {name}
    </span>
  );
};
