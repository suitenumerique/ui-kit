import cunninghamConfig from "../../cunningham";

describe("UI Kit theme compatibility", () => {
  it("keeps all existing UI Kit theme variants", () => {
    expect(Object.keys(cunninghamConfig.themes)).toEqual([
      "default",
      "dark",
      "dsfr-light",
      "dsfr-dark",
      "anct-light",
      "anct-dark",
    ]);
  });

  it("includes Cunningham defaults and UI Kit overrides in one token tree", () => {
    const defaultTheme = cunninghamConfig.themes.default as Record<
      string,
      Record<string, Record<string, unknown>>
    >;
    expect(defaultTheme.components.button["medium-height"]).toBe("40px");
    expect(defaultTheme.components.alert).toBeDefined();
    expect(defaultTheme.components["resize-handle"]["hover--color"]).toBe(
      "ref(contextuals.border.surface.primary)",
    );
  });
});
