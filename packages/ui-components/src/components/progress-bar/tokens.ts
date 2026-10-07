import { DefaultTokens } from "@gouvfr-lasuite/ui-tokens";

export const tokens = (defaults: DefaultTokens) => ({
  height: "4px",
  "border-radius": "50vw",
  color: defaults.contextuals.background.semantic.brand.primary,
  "track-color": defaults.contextuals.background.semantic.neutral.tertiary,
});
