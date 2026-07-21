import { useCunningham } from "@gouvfr-lasuite/cunningham-react";
import type { TranslationKey } from "../types/translations";

/**
 * Type for custom translations - maps translation keys to their string values
 */
export type CustomTranslations = Partial<Record<TranslationKey, string>>;

/**
 * Hook for using custom translations with type safety.
 *
 * This hook provides a translation function that first checks custom translations,
 * then falls back to the default Cunningham translations.
 *
 * Note: This is not a bullet proof solution, it doesn't handle variables replacement
 * as Cunningham does for now.
 *
 * @param customTranslations - Optional object mapping translation keys to custom values
 * @returns Object containing the translation function
 */
export const useCustomTranslations = (
  customTranslations?: CustomTranslations
) => {
  const { t } = useCunningham();
  return {
    t: (key: TranslationKey) => customTranslations?.[key] ?? t(key),
  };
};
