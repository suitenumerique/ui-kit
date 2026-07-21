import { IconProps } from "./Icon";
import { IconSize } from "./types";
import { iconSizeMap } from "./utils";

export type IconSvgProps = Omit<Partial<IconProps>, "name" | "type">;

export const IconSvg = (
  props: React.SVGProps<SVGSVGElement> & IconSvgProps,
) => {
  let size: number;
  if (typeof props.size === "number") {
    size = props.size;
  } else if (props.size && iconSizeMap[props.size as IconSize]) {
    size = iconSizeMap[props.size as IconSize];
  } else {
    size = 24;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {props.children}
    </svg>
  );
};
