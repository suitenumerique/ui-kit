/**
 * Transform such object:
 * {
 *     theme: {
 *         colors: {
 *            "primary-500": "blue"
 *         }
 *     }
 * }
 *
 * to:
 * {
 *     theme: {
 *         colors: {
 *             "primary-500": "ref(theme.colors.primary-500)"
 *         }
 *     }
 * }
 * @param tokens_
 */
export const buildRefs = <T extends Object>(tokens_: T): T => {
  const buildRefsAux = (upperKey: string, subTokens: unknown): unknown => {
    if (subTokens !== null && typeof subTokens === "object") {
      const obj: Record<string, unknown> = {};
      Object.entries(subTokens).forEach(([key, value]) => {
        obj[key] = buildRefsAux((upperKey ? upperKey + "." : "") + key, value);
      });
      return obj;
    }
    return "ref(" + upperKey + ")";
  };
  return buildRefsAux("", tokens_) as T;
};
