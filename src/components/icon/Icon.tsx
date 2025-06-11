import React from "react";
import clsx from "clsx";
import { IconSize, IconType } from "./types";

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

export const Icon: React.FC<IconProps> = ({
  name,
  size,
  className,
  color,

  type = IconType.FILLED,
  ...props
}) => {
  const iconClasses = clsx(
    ``,
    {
      [`icon--${size}`]: size !== undefined,
      [`material-icons-${type}`]: type !== IconType.OUTLINED,
      "material-icons": type === IconType.OUTLINED,
    },
    className
  );

  const style = {
    color: color,
    fontSize: typeof size === "number" ? `${size}px` : undefined,
  };

  return (
    <span className={iconClasses} style={style} {...props}>
      {name}
    </span>
  );
};
