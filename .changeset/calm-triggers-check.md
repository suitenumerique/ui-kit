---
"@gouvfr-lasuite/ui-codemod": minor
---

Add the `dropdown-menu` command, which lists the code to update by hand for the rebuilt `DropdownMenu`, with its file and line: triggers that cannot receive the menu button props or have no accessible name, a trigger `onClick` that only opened the menu under a condition, `MenuItemBody` inside React Aria components whose text slots have no `label`, plain actions given a `value`, and the classes the previous menu rendered. It never modifies files, and exits with 1 when it finds an error.

`migrate` sets `@gouvfr-lasuite/ui-components` to `^2.0.0` instead of `^1.0.0`, so a migrated application gets the rebuilt `DropdownMenu` in one step.
