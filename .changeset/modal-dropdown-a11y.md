---
"@gouvfr-lasuite/ui-components": patch
---

Toasts stay exposed to assistive tech while a modal is open, because the toast container is now a sibling of `.c__app` instead of inside it. Styles aimed at `.c__app .Toastify`, or inherited from `.c__app`, no longer apply to it. Dialog and menu names no longer stringify JSX titles.
