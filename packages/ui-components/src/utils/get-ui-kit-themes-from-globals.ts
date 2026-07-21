import { getThemesFromGlobals } from "@gouvfr-lasuite/cunningham-tokens";
import { deepMerge } from "./objects";
import { commonTokenOverrides, commonGlobals } from "../../cunningham";



// Utils functions to create a theme from a set of globals with UIKit overrides applied by default
export const getUIKitThemesFromGlobals = (globals: Parameters<typeof getThemesFromGlobals>[0], options: Parameters<typeof getThemesFromGlobals>[1] = {}) => {
    return getThemesFromGlobals(
        deepMerge(commonGlobals, globals!), {
      ...options,
      overrides: deepMerge(commonTokenOverrides, options.overrides ?? {}),
    });
  };
