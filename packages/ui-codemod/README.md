# `@gouvfr-lasuite/ui-codemod`

One-off migration CLI for applications using UI Kit or Cunningham (both the
`@gouvfr-lasuite/cunningham-*` and legacy `@openfun/cunningham-*` packages). It is
distributed on npm only so that it can be executed with `npx`; it is not a
JavaScript library or an application dependency.

Preview the migration first:

```bash
npx @gouvfr-lasuite/ui-codemod@1.1.0 migrate . --source all
```

When the package is not already available, npx asks for confirmation, downloads
this exact version to the npm cache and runs it. It does not add the package to
the target project's `package.json`, lockfile or `node_modules`.

Apply the migration after reviewing the preview:

```bash
npx @gouvfr-lasuite/ui-codemod@1.1.0 migrate . --source all --write
```

Check a repository without modifying it:

```bash
npx @gouvfr-lasuite/ui-codemod@1.1.0 migrate . --source all --check
```

Use `--source ui-kit` or `--source cunningham` to restrict the migration. The
codemod handles JavaScript, JSX, TypeScript, TSX, Sass, CSS and `package.json`.
It never modifies lockfiles. Namespace imports, dynamic expressions and
non-public package paths are reported for manual migration.

## DropdownMenu audit

`DropdownMenu` was rebuilt on the React Aria menu button: its child is now the
trigger element itself. The `dropdown-menu` command lists the code to update by
hand, with its file and line:

```bash
npx @gouvfr-lasuite/ui-codemod@1.1.0 dropdown-menu .
```

It reports as errors:

- triggers that cannot receive the menu button props: text, several children,
  fragments, conditional triggers (`cond && <Button />`), and DOM elements that
  are not focusable or have no interactive role, such as a `<div>` wrapping a
  `Button`. Both sides of a fallback (`trigger ?? <Button />`) are checked;
- a trigger `onClick` that only opened the menu under a condition, as in
  `if (canUpdate) setIsOpen(true)`: the menu now opens on press by itself, so
  the condition no longer applies. A condition on the open state itself
  (`isOpen ? close() : open()`) is fine, and a disabled trigger turns the error
  into a warning;
- `MenuItemBody` rendered inside a React Aria component whose text slots have
  no `label` (`TextField`, `Select` outside its popover, `GridListItem`,
  `TagGroup`, ...) without `withSlots={false}`.

It reports as warnings, to check once:

- triggers it cannot read statically: a custom component, a variable, spread
  props;
- triggers that may have no accessible name, such as an icon-only `Button`
  without `aria-label`;
- options with a `value` in a menu without `selectedValues` nor
  `onSelectValue`, which are now radio items;
- classes the previous menu rendered, and `c__dropdown-menu-trigger`, which
  now only `DropdownMenu.Trigger` renders, in styles and scripts;
- files it cannot parse.

The command never modifies files. It exits with 1 when it finds an error, so it
can run in CI. It reads `DropdownMenu` and `MenuItemBody` imported from
`@gouvfr-lasuite/ui-components` or `@gouvfr-lasuite/ui-kit`. A menu rendered
by an application component is checked inside that component, and the trigger
it receives from elsewhere is reported as a warning to check.

The CLI is the package's only public interface. Its internal transformation
modules are deliberately not exported.
