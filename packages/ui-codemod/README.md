# `@gouvfr-lasuite/ui-codemod`

One-off migration CLI for applications using UI Kit or Cunningham (both the
`@gouvfr-lasuite/cunningham-*` and legacy `@openfun/cunningham-*` packages). It is
distributed on npm only so that it can be executed with `npx`; it is not a
JavaScript library or an application dependency.

Preview the migration first:

```bash
npx @gouvfr-lasuite/ui-codemod@1.0.0 migrate . --source all
```

When the package is not already available, npx asks for confirmation, downloads
this exact version to the npm cache and runs it. It does not add the package to
the target project's `package.json`, lockfile or `node_modules`.

Apply the migration after reviewing the preview:

```bash
npx @gouvfr-lasuite/ui-codemod@1.0.0 migrate . --source all --write
```

Check a repository without modifying it:

```bash
npx @gouvfr-lasuite/ui-codemod@1.0.0 migrate . --source all --check
```

Use `--source ui-kit` or `--source cunningham` to restrict the migration. The
codemod handles JavaScript, JSX, TypeScript, TSX, Sass, CSS and `package.json`.
It never modifies lockfiles. Namespace imports, dynamic expressions and
non-public package paths are reported for manual migration.

The CLI is the package's only public interface. Its internal transformation
modules are deliberately not exported.
