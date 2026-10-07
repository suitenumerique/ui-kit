---
"@gouvfr-lasuite/ui-components": major
---

**Breaking:** `ProgressBar` takes `value` (0 to 100) instead of `duration`. `<ProgressBar duration={3000} />` no longer works. Leave `value` unset for the indeterminate animation.

**Breaking:** Alert and Toast now share their content classes. `c__alert__content*`, `c__alert__icon`, `c__alert__action*`, `c__toast__content*` and `c__toast__icon` become `c__notification__content*`, `c__notification__icon` and `c__notification__action*`. The toast progress is now `c__toast__progress`. Styles targeting the old names must be updated.

Refresh the Alert look. The info variant now uses the brand color. Alert and Toast accept `closeLabel` to name the close button.

Toast: `actions` accepts a list of `{ label, onClick }`, `useToastProvider` exposes `updateToast` and `dismissToast`, and `position` (or `toastPosition` on `CunninghamProvider`) chooses the corner.
