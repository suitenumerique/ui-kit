export const resolve = (
  object: Record<string, unknown>,
  path: string,
  separator: string = ".",
): unknown => {
  return path.split(separator).reduce<unknown>((acc, cur) => {
    return (acc as Record<string, unknown>)[cur];
  }, object);
};
