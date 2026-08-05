import { DefaultTokens } from "@gouvfr-lasuite/ui-tokens";

export const tokens = (defaults: DefaultTokens) => ({
  "font-weight": defaults.globals.font.weights.regular,
  "font-size": defaults.globals.font.sizes.sm,
  "border-radius": "8px",
  "border-radius--hover": "4px",
  "border-radius--focus": "4px",
  "border-width": "1px",
  "border-width--hover": "1px",
  "border-width--focus": "1px",
  "border-color": defaults.contextuals.border.semantic.neutral.tertiary,
  "border-color--hover": defaults.contextuals.border.semantic.neutral.tertiary,
  "border-color--focus": defaults.contextuals.border.semantic.brand.primary,
  "border-style": "solid",
  "placeholder-color": defaults.contextuals.content.semantic.neutral.tertiary,
  "label-color": defaults.contextuals.content.semantic.neutral.tertiary,
  "label-color--focus": defaults.contextuals.content.semantic.brand.primary,
  "background-color": defaults.contextuals.background.surface.secondary,
  "value-color": defaults.contextuals.content.semantic.neutral.primary,
  "value-color--disabled":
    defaults.contextuals.content.semantic.disabled.primary,

  // Inline variant tokens
  "inline-min-height": "40px",
  "inline-border-radius": defaults.globals.spacings.xxxs,
  "inline-padding-block": defaults.globals.spacings.xxs,
  "inline-padding-inline": defaults.globals.spacings.xs,
  "inline-background-color--disabled":
    defaults.contextuals.background.semantic.disabled.secondary,
  "inline-border-color--disabled":
    defaults.contextuals.border.semantic.disabled.primary,
});
