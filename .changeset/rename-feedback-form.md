---
"@gouvfr-lasuite/ui-components": major
---

Rename FeedbackForm to GenericSupportForm, now documented with the other support
forms under "Components/SupportForm". To update an app:

- `FeedbackForm` and its `FeedbackFormProps`, `FeedbackFormData`,
  `FeedbackFormLabels` and `FeedbackFormPlacement` types become
  `GenericSupportForm`, `GenericSupportFormProps`, etc.;
- the HelpMenu `feedbackForm` prop becomes `genericSupportForm`, and its
  `HelpMenuFeedbackConfig` type becomes `HelpMenuGenericSupportConfig`;
- the `c__feedback-form*` CSS classes become `c__generic-support-form*`;
- the `components.feedbackForm.*` translation keys become
  `components.genericSupportForm.*`.
