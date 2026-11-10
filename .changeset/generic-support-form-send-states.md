---
"@gouvfr-lasuite/ui-components": minor
---

GenericSupportForm: check the fields on submit and show the result of the send. The Send
button is no longer disabled until the form is valid: a click shows the missing or
invalid fields and focuses the first one. When `onSend` returns a promise, the form
shows a sending state, then a success view or the error message. Refused files now
say why. New props: `email`, `requireEmail`, `maxFiles` and `onSuccessClose`.
