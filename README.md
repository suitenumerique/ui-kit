# La Suite numérique UI

This repository is the canonical home of the La Suite numérique design system.
It combines the former UI Kit and Cunningham repositories in a private Yarn 1
and Turborepo workspace.

Browse the unified component documentation in the public
[Storybook](https://suitenumerique.github.io/ui-kit/).

The Cunningham sources are a history-free snapshot of commit
[`3c13c21`](https://github.com/suitenumerique/cunningham/tree/3c13c21726d632a2a6ca41d2e7a4bbe28334c90b),
the React `4.3.1` release.

## Packages

| Package                                                     | Purpose                                                                                                      |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [`@gouvfr-lasuite/ui-components`](./packages/ui-components) | All React components, SVG icons, styles, fonts, tests and Storybook documentation from UI Kit and Cunningham |
| [`@gouvfr-lasuite/ui-tokens`](./packages/ui-tokens)         | Cunningham token engine, CLI, default tokens, theming helpers and CSS/SCSS/JS/TS generators                  |
| [`@gouvfr-lasuite/ui-codemod`](./packages/ui-codemod)       | One-off npx migration CLI for the former package names and public subpaths                                   |

The component package depends on the token package through its published semver
range. Package versions are independent and managed by Changesets.

Run the migration CLI without adding it to an application dependency list:

```bash
npx @gouvfr-lasuite/ui-codemod@1.0.0 migrate . --source all
```

npx downloads the exact CLI version to the npm cache after confirmation and
does not modify the target project's `package.json`, lockfile or `node_modules`.

## Development

Node 24 (the version pinned in `.nvmrc`) and Yarn 1.22.22 are required.

```bash
yarn install --frozen-lockfile
yarn build
yarn lint
yarn test
yarn test:ct
yarn build-storybook
```

Run the unified documentation locally with `yarn storybook`. Add a release note
with `yarn changeset`. Packages are versioned and published manually; follow
[`RELEASING.md`](./docs/RELEASING.md) for the complete procedure.

See [`MIGRATION.md`](./docs/MIGRATION.md) for consumer migration instructions
and [`CONTRIBUTING.md`](./docs/CONTRIBUTING.md) to contribute to the project.
