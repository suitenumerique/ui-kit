export const getExtensionFromName = (str: string): string | null => {
  if (!str) {
    return null;
  }
  const parts = str.split(".");
  if (parts.length === 1) {
    return null;
  }
  return parts.pop()!;
};
