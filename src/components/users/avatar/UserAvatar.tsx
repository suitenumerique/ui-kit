import clsx from "clsx";
import { getUserInitials, getUserColor, AVATAR_COLORS } from "./utils";

export type AvatarProps = {
  fullName: string;
  size?: "xsmall" | "small" | "medium" | "large";
  forceColor?: string;
  backgroundColor?: (typeof AVATAR_COLORS)[number];
};

export const UserAvatar = ({
  fullName,
  size = "medium",
  forceColor,
  backgroundColor: color,
}: AvatarProps) => {
  const initials = getUserInitials(fullName);
  const backgroundColor = color ? color : getUserColor(fullName);
  return (
    <div
      style={{ backgroundColor: forceColor ? forceColor : undefined }}
      className={clsx(`c__avatar ${size}`, {
        [backgroundColor]: !forceColor && backgroundColor,
      })}
    >
      <div className="c__avatar__initials">{initials}</div>
    </div>
  );
};
