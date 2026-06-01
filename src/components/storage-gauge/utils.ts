export type StorageGaugeStatus = "default" | "warning" | "full";

/** Usage ratio (0-1) at which the gauge switches to the warning color. */
export const DEFAULT_WARNING_THRESHOLD = 0.9;
/** Usage ratio (0-1) at which the gauge switches to the full/error color. */
export const DEFAULT_FULL_THRESHOLD = 1;

/**
 * Derive the gauge status from the used/total ratio.
 */
export const getStorageGaugeStatus = (
  used: number,
  total: number,
  warningThreshold: number = DEFAULT_WARNING_THRESHOLD,
  fullThreshold: number = DEFAULT_FULL_THRESHOLD,
): StorageGaugeStatus => {
  const ratio = total > 0 ? used / total : 0;
  if (ratio >= fullThreshold) {
    return "full";
  }
  if (ratio >= warningThreshold) {
    return "warning";
  }
  return "default";
};

/**
 * The fill width of the gauge bar, clamped to the 0-100 range.
 */
export const getStorageGaugePercentage = (
  used: number,
  total: number,
): number => {
  if (total <= 0) {
    return 0;
  }
  return Math.min(Math.max((used / total) * 100, 0), 100);
};

/**
 * Locale-aware number formatting shared by the gauge components.
 */
export const formatStorageNumber = (
  value: number,
  locale: string,
  decimals: number,
): string =>
  value.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
