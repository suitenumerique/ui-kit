import { default as originalEnUS } from "./originals/en-US.json";
import { default as originalFrFR } from "./originals/fr-FR.json";
import { default as enUS } from "./en-US.json";
import { default as frFR } from "./fr-FR.json";
import { deepMerge } from "../utils/objects";

export function getLocales() {
  return {
    enUS: deepMerge(originalEnUS, enUS),
    frFR: deepMerge(originalFrFR, frFR),
  };
}
