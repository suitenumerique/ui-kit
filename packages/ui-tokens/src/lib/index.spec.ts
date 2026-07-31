import { buildRefs, getThemesFromGlobals } from "./index";

// The generated themes are plain nested token trees; give the assertions a
// recursive shape so property access stays typed without any.
type TokenTree = { [key: string]: TokenTree };
const themesAsTrees = (themes: ReturnType<typeof getThemesFromGlobals>) =>
  themes as unknown as Record<string, TokenTree>;

describe("buildRefs", () => {
  it("should replace raw values by ref keys", () => {
    expect(
      buildRefs({
        theme: {
          colors: {
            "primary-500": "blue",
          },
        },
      }),
    ).toEqual({
      theme: {
        colors: {
          "primary-500": "ref(theme.colors.primary-500)",
        },
      },
    });
  });
});

describe("getThemesFromGlobals", () => {
  it("should return a theme from a set of globals", () => {
    const themes = getThemesFromGlobals({
      colors: { "brand-500": "blue" },
      font: { families: { base: "Comic Sans MS" } },
    });

    expect(Object.keys(themes)).toEqual(["light", "dark"]);
    expect(themesAsTrees(themes).light.globals.colors["brand-500"]).toEqual("blue");
    expect(themesAsTrees(themes).dark.globals.colors["brand-500"]).toEqual("blue");
    expect(themesAsTrees(themes).light.globals.font.families.base).toEqual("Comic Sans MS");
    expect(themesAsTrees(themes).dark.globals.font.families.base).toEqual("Comic Sans MS");
    expect(themesAsTrees(themes).light.contextuals).toBeDefined();
    expect(themesAsTrees(themes).dark.contextuals).toBeDefined();
  });

  it("should allow to prefix the theme names", () => {
    const themes = getThemesFromGlobals({}, { prefix: "custom" });

    expect(Object.keys(themes)).toEqual(["custom-light", "custom-dark"]);
  });

  it("should allow to get theme for a subset of variants", () => {
    const themes = getThemesFromGlobals({}, { variants: ["light"] });

    expect(Object.keys(themes)).toEqual(["light"]);
  });

  it("should allow to override/extend themes", () => {
    const themes = getThemesFromGlobals(
      {},
      {
        overrides: {
          components: {
            button: {
              "font-family": "Papyrus",
            },
          },
        },
      },
    );

    expect(themesAsTrees(themes).light.components.button["font-family"]).toEqual("Papyrus");
  });
});
