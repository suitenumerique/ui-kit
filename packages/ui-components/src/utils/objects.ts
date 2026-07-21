function isObject(item: unknown) {
  return item && typeof item === "object" && !Array.isArray(item);
}


export function deepMerge<
  T extends Record<PropertyKey, unknown>,
  S extends Record<PropertyKey, unknown>[]
>(target: T, ...sources: S): T & S[number] {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key] as T, source[key] as S[number]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return deepMerge(target, ...sources);
}
