import { useCunningham } from ":/components/provider";
import type { TranslationKey } from "../types/translations";

/**
 * Type for custom translations - maps translation keys to their string values
 */
export type CustomTranslations = Partial<Record<TranslationKey, string>>;

type TranslationVars = Record<string, string | number>;

const replaceVars = (message: string, vars?: TranslationVars) => {
  if (!vars) {
    return message;
  }
  return Object.keys(vars).reduce(
    (result, varName) => result.replace(`{${varName}}`, "" + vars[varName]),
    message,
  );
};

/**
 * Hook for using custom translations with type safety.
 *
 * This hook provides a translation function that first checks custom translations,
 * then falls back to the default Cunningham translations. Variables in the form
 * of {varName} are replaced in both cases.
 *
 * @param customTranslations - Optional object mapping translation keys to custom values
 * @returns Object containing the translation function
 */
export const useCustomTranslations = (
  customTranslations?: CustomTranslations
) => {
  const { t } = useCunningham();
  return {
    t: (key: TranslationKey, vars?: TranslationVars) => {
      const customMessage = customTranslations?.[key];
      return customMessage !== undefined
        ? replaceVars(customMessage, vars)
        : t(key, vars);
    },
  };
};
