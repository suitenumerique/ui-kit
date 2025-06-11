import { IconSize } from "./types";

export const iconSizeMap: Record<IconSize, number> = {
  [IconSize.X_SMALL]: 11,
  [IconSize.SMALL]: 16,
  [IconSize.MEDIUM]: 24,
  [IconSize.LARGE]: 32,
  [IconSize.X_LARGE]: 40,
};

export const containerSizeMap: Record<IconSize, number> = {
  [IconSize.X_SMALL]: 16,
  [IconSize.SMALL]: 24,
  [IconSize.MEDIUM]: 32,
  [IconSize.LARGE]: 40,
  [IconSize.X_LARGE]: 48,
};

export const getContainerSize = (iconSize: IconSize): number => {
  return containerSizeMap[iconSize] ?? 24;
};


export const getIconSize = (iconSize: IconSize): number => {
  return iconSizeMap[iconSize] ?? 24;
};