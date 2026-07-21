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
 * A TS test to ensure that the translations are consistent
 * between the different locales. In case of a mismatch, the
 * `assertTranslationKeysMatch` will raise an TS error so it was not
 * possible to build the package.
 */
type EnKeys = ExtractTranslationKeys<typeof locales["en-US"]>;
type FrKeys = ExtractTranslationKeys<typeof locales["fr-FR"]>;

// @ts-expect-error : TS6133 - assertTranslationKeysMatch is not used
function assertTranslationKeysMatch(): AssertIsStrictEqual<EnKeys, FrKeys> {
  return true;
}
