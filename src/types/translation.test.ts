/* eslint-disable @typescript-eslint/no-unused-vars */
import { locales } from ":/locales/Locale";

/** Translation type testing */

import { ExtractTranslationKeys } from "./translations";

type AssertIsStrictEqual<T, U> = (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U
  ? 1 : 2
  ? true : { error: "Types are not equal"; expected: U; actual: T };


//
// fr-FR and en-US should have the same keys
//
type EnKeys = ExtractTranslationKeys<typeof locales["en-US"]>;
type FrKeys = ExtractTranslationKeys<typeof locales["fr-FR"]>;
function assertTranslationKeysMatch(): AssertIsStrictEqual<EnKeys, FrKeys> {
  return true;
}
