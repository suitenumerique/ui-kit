---
"@gouvfr-lasuite/ui-components": minor
---

♿️(modal) improve Modal accessibility

The modal title is an `h2` that names the dialog through `aria-labelledby`, and the subtitle describes it through `aria-describedby`. `aria-label` now only applies when the modal has no visible title. Title icons and close button icons are hidden from assistive technologies.

The close and back to tabs buttons are translated. The close button is now named `Close` instead of `close` in English (`Fermer` in French): tests querying it by its name must be updated.

The tab variant relies on React Aria tabs: arrow keys, Home and End move the focus, Enter or Space selects the tab, the tab list is named by the sidebar title and the panel by its tab. Tab titles are `h3` headings. On small screens, the half of the layout that is off screen is `inert`, the focus moves to the back button when a tab opens and back to the tab when returning, and it stays inside the dialog.

The date picker calendar popover is named.
