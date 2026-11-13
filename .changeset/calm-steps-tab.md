---
"@gouvfr-lasuite/ui-components": patch
---

♿️(onboarding) improve OnboardingModal accessibility

When the steps have a preview, they are a vertical tab list with manual activation, built on react-aria like the tab variant of the Modal: arrow keys, Home and End move the focus between steps, Enter, Space or a click selects the step. Only the steps are in the tab order, and tabbing back into the list lands on the selected step. The preview panel is named by the selected step and is focusable only when its content is not.

Without a preview (text-only mode and `ReleaseNoteModal`), the steps are a list of buttons and the selected one is marked with `aria-current="step"`.

Each step is named by its title, and the selected step is described by its description.

The Next and Previous buttons announce the new step through a polite status region, since the focus stays on them. The first step is no longer focused when the modal opens: the focus follows the Modal default.

Steps accept an optional `contentAlt` to describe the preview content when it has no text alternative of its own.

A footer link that opens in a new window shows an external-link icon and announces it.

`OnboardingStepItemProps` now takes `titleId` and `descriptionId` instead of `onClick`, `totalSteps` and `ariaLabel`.
