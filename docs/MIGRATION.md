# Migration from UI Kit and Cunningham

The former packages are replaced by:

- `@gouvfr-lasuite/ui-kit` → `@gouvfr-lasuite/ui-components`
- `@gouvfr-lasuite/cunningham-react` → `@gouvfr-lasuite/ui-components`
- `@gouvfr-lasuite/cunningham-tokens` → `@gouvfr-lasuite/ui-tokens`

No compatibility packages are published under the old names. Existing npm
versions remain installable.

## Automated migration

The codemod is a one-off CLI distributed through npm. Running it with npx
downloads the exact version to the npm cache after confirmation; it does not
add a dependency to the target project's `package.json`, lockfile or
`node_modules`.

Preview changes first:

```bash
npx @gouvfr-lasuite/ui-codemod@1.0.0 migrate . --source all
```

Apply them after reviewing the report:

```bash
npx @gouvfr-lasuite/ui-codemod@1.0.0 migrate . --source all --write
```

Use the read-only check mode to fail when files still need migration or when a
manual case is found:

```bash
npx @gouvfr-lasuite/ui-codemod@1.0.0 migrate . --source all --check
```

The codemod handles JS, JSX, TS, TSX, Sass, CSS and `package.json`; it never
modifies lockfiles.

Namespace imports, dynamic package expressions and internal paths that were not
part of the former public exports are intentionally left unchanged and reported.

## Public paths

| Former import                                      | New import                                          |
| -------------------------------------------------- | --------------------------------------------------- |
| `@gouvfr-lasuite/ui-kit/icons`                     | `@gouvfr-lasuite/ui-components/icons`               |
| `@gouvfr-lasuite/ui-kit/style`                     | `@gouvfr-lasuite/ui-components/style`               |
| `@gouvfr-lasuite/ui-kit/fonts/Marianne`            | `@gouvfr-lasuite/ui-components/fonts/marianne`      |
| `@gouvfr-lasuite/ui-kit/sass/fonts`                | `@gouvfr-lasuite/ui-components/sass/fonts/lasuite`  |
| `@gouvfr-lasuite/cunningham-react/style`           | `@gouvfr-lasuite/ui-components/style`               |
| `@gouvfr-lasuite/cunningham-react/fonts`           | `@gouvfr-lasuite/ui-components/fonts/roboto`        |
| `@gouvfr-lasuite/cunningham-react/icons`           | `@gouvfr-lasuite/ui-components/material-icons`      |
| `@gouvfr-lasuite/cunningham-react/sass/fonts`      | `@gouvfr-lasuite/ui-components/sass/fonts/roboto`   |
| `@gouvfr-lasuite/cunningham-react/sass/icons`      | `@gouvfr-lasuite/ui-components/sass/material-icons` |
| `@gouvfr-lasuite/cunningham-tokens/default-tokens` | `@gouvfr-lasuite/ui-tokens/default-tokens`          |

Named SVG imports from the former UI Kit root are split automatically between
the new package root and `/icons`. Aliases and type imports are preserved.

## Repository deprecation checklist

After the three new packages have been published and verified in a real
consumer application by following [`RELEASING.md`](./RELEASING.md):

1. add a deprecation banner and a link to this guide to Cunningham;
2. disable its release and publication workflows;
3. transfer still-relevant issues to `suitenumerique/ui-kit`;
4. deprecate the three former npm packages with a link to this guide;
5. archive the Cunningham repository.

These remote operations are deliberately performed only after publication has
been validated.
