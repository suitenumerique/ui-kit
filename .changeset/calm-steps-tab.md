---
"@gouvfr-lasuite/ui-components": patch
---

♿️(onboarding) improve OnboardingModal accessibility

- Steps with a preview are a vertical tab list (arrows, Home, End, Enter or Space); without a preview, a list of buttons marking the current step.
- Next and Previous announce the new step, and the first step is no longer focused at opening.
- Steps accept an optional `contentAlt` to describe the preview.
- A footer link opening a new window says so, and a footer action without `href` is a button.
- `OnboardingStepItemProps` takes `titleId` and `descriptionId` instead of `onClick`, `totalSteps` and `ariaLabel`.
