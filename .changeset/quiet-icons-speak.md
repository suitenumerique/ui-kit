---
"@gouvfr-lasuite/ui-components": patch
---

Replace Material icon ligatures that leaked English into accessible names with the existing SVG icons, and hide the remaining ligatures from assistive technologies. Icon-only buttons in the share flow and the file preview now expose a translated name.

`arrow_drop_up` has no exported glyph, so the open share-link menu rotates `ArrowDropDown`. `language`, `feedback`, `mark_email_read` and `public` stay on the Material font until those glyphs are checked in Figma.
