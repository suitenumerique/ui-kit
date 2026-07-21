# @gouvfr-lasuite/ui-codemod

## [UNRELEASED]

## 1.0.0

### Major Changes

- Add the `migrate` command for converting UI Kit and Cunningham imports,
  styles and package dependencies to the new package names.
- Publish the migration tool as an npx-only CLI without a public JavaScript
  import API or a persistent application dependency.
- Run in read-only mode by default, with `--write` for applying changes and
  `--check` for CI or scripted verification.
- Split mixed UI Kit component and SVG imports while preserving aliases and
  type imports, and report cases that require a manual migration.
