import { useCunningham } from "@openfun/cunningham-react";

// Would be cool in the future to handle objects.
export type CustomTranslations = Record<string, string>;

/**
 * This is not a bullet proof solution, it doesn't handle variables replacement
 * as Cunningham does for now.
 */
export const useCustomTranslations = (
  customTranslations?: CustomTranslations
) => {
  const { t } = useCunningham();
  return {
    t: (key: string) => customTranslations?.[key] || t(key),
  };
};
