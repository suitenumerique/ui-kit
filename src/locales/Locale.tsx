import {enUS as originalEnUS, frFR as originalFrFR} from "@openfun/cunningham-react";
import { default as enUS } from "./en-US.json";
import { default as frFR } from "./fr-FR.json";
import { deepMerge } from "../utils/objects";

export function getLocales() {
  return {
    "en-US": deepMerge(originalEnUS, enUS),
    "fr-FR": deepMerge(originalFrFR, frFR),
  };
}
