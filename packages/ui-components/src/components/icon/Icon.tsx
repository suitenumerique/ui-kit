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
    "material-icons",
    {
      [`icon--${size}`]: size !== undefined,
      [`icon--${type}`]: type !== IconType.OUTLINED,
    },
    className
  );

  const style = {
    color: color,
    fontSize: typeof size === "number" ? `${size}px` : undefined,
  };

  // The ligature is an English word ("home", "close", …): keep it out of the
  // accessible name unless the icon is explicitly labelled.
  const hasValue = (value: unknown) =>
    typeof value === "string" && value.trim() !== "";
  const isLabelled =
    hasValue(props["aria-label"]) || hasValue(props["aria-labelledby"]);

  return (
    <span
      className={iconClasses}
      style={style}
      // A labelled icon is an image. A bare span would ignore aria-label.
      role={isLabelled ? "img" : undefined}
      aria-hidden={isLabelled ? undefined : true}
      {...props}
    >
      {name}
    </span>
  );
};
