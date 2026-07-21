import clsx from "clsx";
import { CSSProperties } from "react";

export type AbstractSeparatorProps = {
  withPadding?: boolean;
  direction: "horizontal" | "vertical";
  width?: "thin" | "double";
  size?: string;
};

/**
 * An abstract component which display a vertical or horizontal separator.
 * It should not be used directly, but rather extended by the concrete implementations.
 * See `HorizontalSeparator` and `VerticalSeparator` for concrete implementations.
 */
export const _AbstractSeparator = ({ withPadding = true, direction, width = "thin", size }: AbstractSeparatorProps) => {
  return <div
    style={{'--size': size} as CSSProperties}
    className={
        clsx(
            "c__separator",
            `c__separator--${direction}`,
            `c__separator--${width}`,
            { "with-padding": withPadding },
        )
    }
  />;
};
