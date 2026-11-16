// Pure helpers of the GenericSupportForm.

export const isValidEmail = (email: string) => {
  return !!email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z\-0-9]{2,}))$/,
  );
};

/** The email given by the app, if it is valid. */
export const getKnownEmail = (email?: string) => {
  const trimmed = email?.trim();
  if (trimmed && isValidEmail(trimmed)) return trimmed;
  return undefined;
};

export const truncateFileName = (name: string, maxLength = 15) => {
  if (name.length <= maxLength) return name;
  const ext = name.lastIndexOf(".");
  if (ext > 0) {
    const extension = name.slice(ext);
    const base = name.slice(0, maxLength - extension.length - 3);
    return `${base}...${extension}`;
  }
  return `${name.slice(0, maxLength - 3)}...`;
};

/** Accepts MIME types (`image/png`), wildcards (`image/*`) and extensions (`.txt`). */
export const isAcceptedType = (file: File, acceptedTypes: string[]) => {
  const mimeType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  return acceptedTypes.some((acceptedType) => {
    const type = acceptedType.trim().toLowerCase();
    if (type.startsWith(".")) return fileName.endsWith(type);
    if (type.endsWith("/*")) return mimeType.startsWith(type.slice(0, -1));
    return mimeType === type;
  });
};

export const isPromiseLike = (value: unknown): value is PromiseLike<unknown> =>
  typeof (value as PromiseLike<unknown> | null)?.then === "function";

const FILE_SIZE_UNITS = {
  megabyte: { divider: 1024 * 1024, fallback: "MB" },
  kilobyte: { divider: 1024, fallback: "KB" },
};

/** "10 MB", "500 kB"… in the user's language. */
export const formatFileSize = (bytes: number, locale: string) => {
  let unit: keyof typeof FILE_SIZE_UNITS = "kilobyte";
  if (bytes >= FILE_SIZE_UNITS.megabyte.divider) unit = "megabyte";
  const value = bytes / FILE_SIZE_UNITS[unit].divider;
  try {
    return new Intl.NumberFormat(locale, {
      style: "unit",
      unit,
      maximumFractionDigits: 1,
    }).format(value);
  } catch {
    return `${Math.round(value * 10) / 10} ${FILE_SIZE_UNITS[unit].fallback}`;
  }
};

/** The message of a required field left empty, once the user tried to send. */
export const getRequiredError = (
  submitted: boolean,
  value: string,
  message: string,
) => {
  if (submitted && !value.trim()) return message;
  return undefined;
};

/** The state a field shows for an optional error message. */
export const getFieldState = (error?: string) => {
  if (error) return "error";
  return "default";
};

/** The message shown when `onSend` rejects. */
export const getSendErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};
