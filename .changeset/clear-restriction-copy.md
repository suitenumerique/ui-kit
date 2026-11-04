---
"@gouvfr-lasuite/ui-components": patch
---

ShareModal: clarify the restriction copy. "Open access" becomes "Expand access",
and the confirmation dialog shows its consequence in bold followed by its details in a
single paragraph. The restriction menu and dialog now follow `customTranslations`, so
apps can name their items (e.g. folders). The `components.share.{restrict,unrestrict}.hint`
keys are replaced by `details`; custom translations overriding `hint` must be renamed.
