---
"@gouvfr-lasuite/ui-components": minor
---

Toasts are built on the React Aria toast region instead of react-toastify, which is no longer a dependency. The public API of `useToastProvider` is unchanged.

- The region is a landmark rendered on `body`, so toasts stay reachable while a modal is open. Press F6 to move focus into it; F6 or Shift+F6 from inside returns focus to where it was. A toast never takes focus when it appears.
- Each message is announced once, after focus has settled: errors and warnings assertively, other types politely. Toasts rendered by `ToastProvider` carry no `status` or `alert` role.
- Errors, warnings and toasts with actions stay until closed and get a close button, unless given a `duration`. Durations under 5 seconds are raised to 5 seconds.
- While the pointer or focus is inside the region, all its toasts pause. When a focused toast closes, focus moves to the next one, or back to where it was.
- `ToastId` is now `string`. The `react-toastify` stylesheet and the `.Toastify*` classes are gone, and the `components.toast.region_aria_label` translation is removed.
