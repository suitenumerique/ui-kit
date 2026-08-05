---
"@gouvfr-lasuite/ui-components": minor
---

Add an `inline` field variant to Input, TextArea and Select

The label — and its new optional `labelDescription` — sits in a left column while the
field takes the right one, on a single row. The label column hugs its content by default;
use the new `labelWidth` prop to pin it and align several fields of the same form.
`labelDescription` is associated with the control through `aria-describedby`.

As a prerequisite, the `Select` label is now rendered as a sibling of `.c__select` instead
of one of its children, so that every field component exposes the same `.c__field`
structure. Styling that targets `.c__select__label` is unaffected; only stylesheets
relying on the descendant selector `.c__select .c__select__label` need updating.

Disabled labels also change colour across **every** variant: the
`forms-labelledbox--label-color--{small,big}--disabled` tokens resolved to
`content.semantic.neutral.secondary`, a regular text colour, and now resolve to
`content.semantic.disabled.primary` as the design requires.
