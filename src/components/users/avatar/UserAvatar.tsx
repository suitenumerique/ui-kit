import clsx from "clsx";
import { getUserInitials, getUserColor } from "./utils";

export type AvatarProps = {
  fullName: string;
  size?: "xsmall" | "small" | "medium" | "large";
  forceColor?: string;
};

export const UserAvatar = ({
  fullName,
  size = "medium",
  forceColor,
}: AvatarProps) => {
  const initials = getUserInitials(fullName);
  const backgroundColor = getUserColor(fullName);
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
