export const PACKAGES = {
  components: "@gouvfr-lasuite/ui-components",
  tokens: "@gouvfr-lasuite/ui-tokens",
};

export const PACKAGE_MAPPINGS = {
  "@gouvfr-lasuite/cunningham-react": PACKAGES.components,
  "@gouvfr-lasuite/cunningham-tokens": PACKAGES.tokens,
  "@openfun/cunningham-react": PACKAGES.components,
  "@openfun/cunningham-tokens": PACKAGES.tokens,
  "@gouvfr-lasuite/ui-kit": PACKAGES.components,
};

const EXACT_SPECIFIER_MAPPINGS = new Map([
  ["@gouvfr-lasuite/cunningham-react", PACKAGES.components],
  ["@gouvfr-lasuite/cunningham-react/style", `${PACKAGES.components}/style`],
  ["@gouvfr-lasuite/cunningham-react/fonts", `${PACKAGES.components}/fonts/roboto`],
  ["@gouvfr-lasuite/cunningham-react/sass/fonts", `${PACKAGES.components}/sass/fonts/roboto`],
  ["@gouvfr-lasuite/cunningham-react/icons", `${PACKAGES.components}/material-icons`],
  ["@gouvfr-lasuite/cunningham-react/sass/icons", `${PACKAGES.components}/sass/material-icons`],
  ["@gouvfr-lasuite/cunningham-tokens", PACKAGES.tokens],
  ["@gouvfr-lasuite/cunningham-tokens/default-tokens", `${PACKAGES.tokens}/default-tokens`],
  ["@openfun/cunningham-react", PACKAGES.components],
  ["@openfun/cunningham-react/style", `${PACKAGES.components}/style`],
  ["@openfun/cunningham-react/fonts", `${PACKAGES.components}/fonts/roboto`],
  ["@openfun/cunningham-react/sass/fonts", `${PACKAGES.components}/sass/fonts/roboto`],
  ["@openfun/cunningham-react/icons", `${PACKAGES.components}/material-icons`],
  ["@openfun/cunningham-react/sass/icons", `${PACKAGES.components}/sass/material-icons`],
  ["@openfun/cunningham-tokens", PACKAGES.tokens],
  ["@openfun/cunningham-tokens/default-tokens", `${PACKAGES.tokens}/default-tokens`],
  ["@gouvfr-lasuite/ui-kit", PACKAGES.components],
  ["@gouvfr-lasuite/ui-kit/icons", `${PACKAGES.components}/icons`],
  ["@gouvfr-lasuite/ui-kit/style", `${PACKAGES.components}/style`],
  ["@gouvfr-lasuite/ui-kit/sass/fonts", `${PACKAGES.components}/sass/fonts/lasuite`],
  ["@gouvfr-lasuite/ui-kit/fonts/Marianne", `${PACKAGES.components}/fonts/marianne`],
]);

const CUNNINGHAM_PACKAGES = [
  "@gouvfr-lasuite/cunningham-react",
  "@gouvfr-lasuite/cunningham-tokens",
  "@openfun/cunningham-react",
  "@openfun/cunningham-tokens",
];

const belongsTo = (specifier, name) =>
  specifier === name || specifier.startsWith(`${name}/`);

export function sourceIsEnabled(specifier, source) {
  if (source === "all") return true;
  if (source === "ui-kit") {
    return belongsTo(specifier, "@gouvfr-lasuite/ui-kit");
  }
  return CUNNINGHAM_PACKAGES.some((name) => belongsTo(specifier, name));
}

export function mapSpecifier(specifier, source = "all") {
  if (!sourceIsEnabled(specifier, source)) return { kind: "ignored" };
  const mapped = EXACT_SPECIFIER_MAPPINGS.get(specifier);
  if (mapped) return { kind: "mapped", value: mapped };

  if (Object.keys(PACKAGE_MAPPINGS).some((name) => specifier.startsWith(`${name}/`))) {
    return { kind: "unsupported" };
  }
  return { kind: "ignored" };
}
