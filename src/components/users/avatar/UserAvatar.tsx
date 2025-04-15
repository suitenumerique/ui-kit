import clsx from "clsx";

const colors = [
  "purple",
  "blue",
  "green",
  "yellow",
  "orange",
  "red",
  "brown",
  "cyan",
  "gold",
  "olive",
  "rose",
];

export type AvatarProps = {
  fullName: string;
  size?: "xsmall" | "small" | "medium" | "large";
  forceColor?: string;
};

// TODO: Add unit test
const getInitials = (name: string) => {
  const parts = name.split(" ");
  if (parts.length > 2) {
    // If there are more than 2 words, take only the first two initials
    return parts
      .slice(0, 2)
      .map((n) => n[0])
      .join("");
  }
  return parts.map((n) => n[0]).join("");
};

const getColor = (name: string) => {
  return colors[name.charCodeAt(0) % colors.length];
};

export const UserAvatar = ({
  fullName,
  size = "medium",
  forceColor,
}: AvatarProps) => {
  const initials = getInitials(fullName);
  const backgroundColor = getColor(fullName);
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
