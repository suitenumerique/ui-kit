---
"@gouvfr-lasuite/ui-components": major
---

**Breaking:** `ProgressBar` takes `value` (0 to 100) instead of `duration`. `<ProgressBar duration={3000} />` no longer works. Leave `value` unset for the indeterminate animation.

Refresh the Alert look. The info variant now uses the brand color.

Toast: `actions` accepts a list of `{ label, onClick }`, `useToastProvider` exposes `updateToast` and `dismissToast`, and `position` (or `toastPosition` on `CunninghamProvider`) chooses the corner.
