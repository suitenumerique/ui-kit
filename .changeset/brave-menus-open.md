---
"@gouvfr-lasuite/ui-components": minor
---

Add `DropdownMenuV2`, an accessible menu built on React Aria that opens from any trigger element (`Button`, a native `<button>`, or any focusable element with `role="button"`). It takes the same `options` as `DropdownMenu`, exposes checked items as radio or checkbox menu items, announces item descriptions and top/bottom messages, and follows the new look with `dropdown-menu` component tokens. The composable parts are exported too: `DropdownMenuV2Trigger`, `DropdownMenuV2Popover`, `MenuItemV2`, `MenuSectionV2`, `MenuSeparatorV2` and `SubmenuTriggerV2`. `DropdownMenu` is unchanged.

`Button` now shows its focus ring from React Aria's input modality (`data-focus-visible`) instead of the browser `:focus-visible` heuristic: the ring shows for keyboard users, including when focus comes back from a menu or a dialog, and no longer after a mouse interaction in Chrome. Elements styled with the `c__button` classes without the `Button` component keep the `:focus-visible` behaviour.

`Tooltip` forwards the props and ref it receives to its child, so it can wrap the trigger of a menu.
