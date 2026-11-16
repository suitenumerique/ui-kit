---
"@gouvfr-lasuite/ui-components": patch
---

Input, TextArea, Checkbox, Radio, Switch, Select (all variants), DatePicker and
DateRangePicker: the message under the field (`text`, e.g. an error) is now linked to the
control with `aria-describedby`, so screen readers read it with the field. With the
classic variant of Input and TextArea, the message lines up with the label instead of
being indented. Checkbox, Radio and Switch no longer include that message in their
accessible name, and get a generated `id` when none is given.

CheckboxGroup and RadioGroup now have a `group` / `radiogroup` role, are described by
their `text`, and accept `aria-labelledby`, `aria-label`, `aria-describedby` and `id`.
Point `aria-labelledby` at the title shown above the group so that screen readers
announce what the options are for.
