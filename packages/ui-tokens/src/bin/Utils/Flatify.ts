export const flatify = (
  obj: Record<string, unknown>,
  separator: string,
): Record<string, unknown> => {
  const flatObj: Record<string, unknown> = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (typeof value === "object") {
      const flatChild = flatify(value as Record<string, unknown>, separator);
      Object.keys(flatChild).forEach((subKey) => {
        flatObj[key + separator + subKey] = flatChild[subKey];
      });
    } else {
      flatObj[key] = value;
    }
  });
  return flatObj;
};
