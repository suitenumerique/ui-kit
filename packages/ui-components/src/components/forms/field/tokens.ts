import { DefaultTokens } from "@gouvfr-lasuite/ui-tokens";

export const tokens = (defaults: DefaultTokens) => ({
  width: "292px",
  "font-size": defaults.globals.font.sizes.s,
  color: defaults.contextuals.content.semantic.neutral.secondary,
  "color--error": defaults.contextuals.content.semantic.error.secondary,
  "color--success": defaults.contextuals.content.semantic.success.secondary,
  "color--disabled": defaults.contextuals.content.semantic.disabled.primary,

  // Inline variant tokens
  "inline-label-width": "max-content",
  "inline-column-gap": defaults.globals.spacings.xs,
  "inline-row-gap": defaults.globals.spacings["3xs"],

  // Label description tokens, shared by the "classic" and "inline" variants
  "label-description-gap": defaults.globals.spacings["4xs"],
  "label-description-font-size": defaults.globals.font.sizes.s,
  "label-description-font-weight": defaults.globals.font.weights.regular,
  "label-description-line-height": "1rem",
  "label-description-color":
    defaults.contextuals.content.semantic.neutral.secondary,
  "label-description-color--disabled":
    defaults.contextuals.content.semantic.disabled.primary,
});
