import { create } from "@storybook/theming";
import { tokens } from "../src/cunningham-tokens";

type DesignTokens = typeof tokens.themes.default;

const buildTheme = (
  { globals, contextuals }: DesignTokens,
  type: "default" | "dark" = "default"
) => {
  return {
    brandUrl: "https://github.com/suitenumerique/cunningham",
    brandImage: `storybook/logo-uikit-${type}.svg`,
    brandTitle: "La Suite UI Kit",
    brandTarget: "_self",

    //
    colorPrimary: contextuals.content.semantic.brand.primary, // content.brand.primary
    colorSecondary: contextuals.content.semantic.brand.primary, // content.brand.secondary

    fontBase: globals.font.families.base,

    // UI
    appBg: contextuals.background.surface.secondary, // background.surface.tertiary
    appContentBg: contextuals.background.surface.tertiary, // background.surface.primary
    appBorderColor: contextuals.border.surface.primary, // border.surface.primary
    appBorderRadius: 4,

    // Text colors
    textColor: contextuals.content.semantic.neutral.primary, // content.neutral.primary
    textInverseColor: contextuals.content.semantic.neutral.secondary, // content.neutral.secondary
    textMutedColor: contextuals.content.semantic.neutral.tertiary,

    // Toolbar default and active colors
    barTextColor: contextuals.content.semantic.neutral.tertiary, // content.neutral.tertiary
    barSelectedColor: contextuals.content.semantic.neutral.primary, // content.neutral.primary
    barSelectedTextColor: contextuals.content.semantic.neutral.primary, // content.neutral.primary
    barBg: contextuals.background.surface.primary, // background.surface.primary

    // Form colors
    inputBg: contextuals.background.surface.primary, // background.surface.primary
    inputBorder: contextuals.border.semantic.neutral.secondary, // border.neutral.secondary
    inputTextColor: contextuals.content.semantic.neutral.primary, // content.neutral.primary
    inputBorderRadius: 2,

    // Code preview colors
    codeBg: contextuals.background.surface.secondary, // background.surface.secondary
    codeColor: contextuals.content.semantic.neutral.primary, // content.neutral.primary
  };
};

export const themes = {
  default: create({
    base: "light",
    ...buildTheme(tokens.themes.default),
  }),
  dark: create({
    base: "dark",
    ...buildTheme(tokens.themes.dark as DesignTokens, "dark"),
  }),
};

export const THEMES = [
  { value: "anct-light", title: "ANCT light", isDark: false },
  { value: "anct-dark", title: "ANCT dark", isDark: true },
  { value: "dsfr-light", title: "DSFR light", isDark: false },
  { value: "dsfr-dark", title: "DSFR dark", isDark: true },
  { value: "default", title: "White label light", isDark: false },
  { value: "dark", title: "White label dark", isDark: true },
];

export const DEFAULT_THEME = "dsfr-light";

const findTheme = (value?: string) =>
  THEMES.find((theme) => theme.value === value) ??
  THEMES.find((theme) => theme.value === DEFAULT_THEME)!;

export const getThemeFromGlobals = (globals): string =>
  findTheme(globals.theme).value;

/** Storybook UI theme (manager and docs) matching a Cunningham theme. */
export const getStorybookTheme = (theme: string) =>
  findTheme(theme).isDark ? themes.dark : themes.default;
