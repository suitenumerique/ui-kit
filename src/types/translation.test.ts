/* eslint-disable @typescript-eslint/no-unused-vars */
import { locales } from ":/locales/Locale";

/** Translation type testing */

import { ExtractTranslationKeys } from "./translations";

/**
 * Want to understand what the hell is that ? Read this:
 * https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650
 */
type AssertIsStrictEqual<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ?
  true : { error: "Types are not equal"; expected: X; actual: Y };


//
// fr-FR and en-US should have the same keys
//
type EnKeys = ExtractTranslationKeys<typeof locales["en-US"]>;
type FrKeys = ExtractTranslationKeys<typeof locales["fr-FR"]>;

// @ts-expect-error : TS6133 - assertTranslationKeysMatch is not used
function assertTranslationKeysMatch(): AssertIsStrictEqual<EnKeys, FrKeys> {
  return true;
}
