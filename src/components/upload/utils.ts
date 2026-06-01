/**
 * Human-readable file size formatting (binary units).
 * e.g. 248 * 1024 * 1024 -> "248 MB", 12 * 1024^3 -> "12 GB".
 */
export const formatBytes = (bytes: number, decimals = 0): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, exponent);
  const rounded = exponent === 0 ? value : Number(value.toFixed(decimals));
  return `${rounded} ${units[exponent]}`;
};

/**
 * Map a file (by mimetype or extension) to a Material icon name used in the
 * upload list. Falls back to a generic document icon.
 */
export const getFileIconName = (name?: string, type?: string): string => {
  const mime = type ?? "";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "movie";
  if (mime.startsWith("audio/")) return "audiotrack";
  if (mime === "application/pdf") return "picture_as_pdf";

  const extension = name?.split(".").pop()?.toLowerCase() ?? "";
  switch (extension) {
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
    case "webp":
      return "image";
    case "mp4":
    case "mov":
    case "avi":
    case "webm":
      return "movie";
    case "mp3":
    case "wav":
    case "ogg":
      return "audiotrack";
    case "pdf":
      return "picture_as_pdf";
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      return "folder_zip";
    default:
      return "description";
  }
};
