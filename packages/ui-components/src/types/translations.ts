import { locales } from ":/locales/Locale";

/**
 * Utility types for extracting all nested keys from translation objects
 * and converting them to dot-notation string literals.
 */

/**
 * Recursively extracts all nested keys from an object type and converts them
 * to dot-notation string literals.
 *
 * @example
 * ```typescript
 * type Example = {
 *   components: {
 *     create: string;
 *     alert: {
 *       close_aria_label: string;
 *       expand_aria_label: string;
 *     }
 *   }
 * }
 *
 * type Keys = TranslationKeys<Example>;
 * // Result: "components.create" | "components.alert.close_aria_label" | "components.alert.expand_aria_label"
 * ```
 */
export type TranslationKeys<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T]: T[K] extends Record<string, unknown>
        ? `${K & string}.${TranslationKeys<T[K]>}`
        : K
    }[keyof T]
  : never;

/**
 * Helper type to define the structure of a translation object.
 * This avoids circular reference by using a more specific definition.
 */
type TranslationValue = string | { [key: string]: TranslationValue };

/**
 * Type constraint for objects that can have translation keys extracted.
 */
export type TranslationObject = Record<string, TranslationValue>;

/**
 * Utility type that combines TranslationKeys with proper constraint checking.
 * Use this as the main export for generating translation key types.
 */
export type ExtractTranslationKeys<T extends TranslationObject> = TranslationKeys<T>;


/**
 * All available translation keys extracted from the English translation file.
 * This type represents all possible keys that can be used with the translation system.
 *
 * Keys are in dot-notation format, e.g.:
 * - "components.share.copyLink"
 * - "components.share.access.delete"
 * - "components.footer.links.legal"
 */
export type TranslationKey = ExtractTranslationKeys<typeof locales["en-US"] | typeof locales["fr-FR"]>;

/**
 * Type representing the structure of a translation object.
 * This can be used to ensure consistency between different locale files.
 */
export type TranslationStructure = typeof locales["en-US"] & typeof locales["fr-FR"];

/**
 * Union type of all supported locales
 */
export type SupportedLocale = keyof typeof locales;
