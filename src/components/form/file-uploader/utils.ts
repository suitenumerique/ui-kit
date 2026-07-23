/**
 * Human-readable file size formatting (decimal units).
 * e.g. 248 * 1000 * 1000 -> "248 MB", 12 * 1000^3 -> "12 GB".
 */
export const formatBytes = (bytes: number, decimals = 0): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1000)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1000, exponent);
  const rounded = exponent === 0 ? value : Number(value.toFixed(decimals));
  return `${rounded} ${units[exponent]}`;
};
