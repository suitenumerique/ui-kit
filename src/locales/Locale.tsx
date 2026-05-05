import {enUS as originalEnUS, frFR as originalFrFR} from "@gouvfr-lasuite/cunningham-react";
import { default as enUS } from "./en-US.json";
import { default as frFR } from "./fr-FR.json";
import { default as nlNL } from "./nl-NL.json";
import { deepMerge } from "../utils/objects";

// Cunningham ships only enUS and frFR. For nl-NL we deep-clone the English
// Cunningham base, then layer Dutch ui-kit strings on top — avoids mutating
// the shared originalEnUS object that "en-US" also derives from.
const nlBase = JSON.parse(JSON.stringify(originalEnUS));

export const locales = {
    "en-US": deepMerge(originalEnUS, enUS),
    "fr-FR": deepMerge(originalFrFR, frFR),
    "nl-NL": deepMerge(nlBase, nlNL),
}
