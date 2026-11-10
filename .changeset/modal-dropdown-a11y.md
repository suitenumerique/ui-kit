---
"@gouvfr-lasuite/ui-components": patch
---

Toasts stay exposed to assistive tech while a modal is open, because the toast container is now a sibling of `.c__app` instead of inside it. Styles aimed at `.c__app .Toastify`, or inherited from `.c__app`, no longer apply to it. Dialog and menu names no longer stringify JSX titles.

`Modal` accepts `aria-labelledby`. The dialog name now comes from `aria-labelledby`, then `aria-label`, then the visible title, so content placed in the title (such as a close button) no longer leaks into the name.
