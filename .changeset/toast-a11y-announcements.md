---
"@gouvfr-lasuite/ui-components": minor
---

Toasts are announced from a live region that is already mounted, after focus has settled. Alt+T moves focus to the first toast, and that shortcut is part of the region's translated name. The timer pauses while a control inside the toast has focus, and focus returns to the previous element if the toast closes while focused. Tooltip animation timers are cleared on close and on unmount.

`ToastProvider` accepts an optional `shortcut` prop. It defaults to `"Alt+T"`. Pass `false` to disable the shortcut.
