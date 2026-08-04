/* eslint-disable @typescript-eslint/no-unused-vars */
import { locales } from ":/locales/Locale";
import { ExtractTranslationKeys } from "./translations";

// Translation type checking

/**
 * Want to understand what the hell is that ? Read this:
 * https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650
 */
type AssertIsStrictEqual<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ?
  true : { error: "Types are not equal"; expected: X; actual: Y };


/**
 * Locale files should have the same keys
 *
 * IN CASE OF TS ERROR, DO NOT REMOVE OR BYPASS THIS TEST
 * INSTEAD FIX TRANSLATION ISSUE.
 *
 * A TS test to ensure that the translations are consistent between
 * `en-US`, the reference locale, and `fr-FR`. In case of a mismatch, the
 * `assertTranslationKeysMatch` will raise an TS error so it was not
 * possible to build the package.
 *
 * Every locale, `fr-FR` included, is checked by
 * `scripts/check-locales.ts`, which fails on any divergence too. This
 * test only brings the same feedback earlier, directly in the IDE, for
 * the locale we touch the most.
 */
type EnKeys = ExtractTranslationKeys<typeof locales["en-US"]>;

/** The locale checked at compile time. */
type BlockingLocale = "fr-FR";

/**
 * `true` for each blocking locale whose keys match `en-US`, an
 * explanatory error object for the others.
 */
type TranslationKeysMatch = {
  [L in BlockingLocale]: AssertIsStrictEqual<
    EnKeys,
    ExtractTranslationKeys<typeof locales[L]>
  >;
};

/**
 * As soon as one locale does not resolve to `true`, the `return` below
 * stops type checking and the TS error names the offending locale.
 */
function assertTranslationKeysMatch(
  match: Record<BlockingLocale, true>
): TranslationKeysMatch {
  return match;
}
