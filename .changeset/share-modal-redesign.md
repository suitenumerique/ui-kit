---
"@gouvfr-lasuite/ui-components": minor
---

💄(share) align the share modal with the sharing mockup

The user search result group is named "Select a user" by default. `searchGroupName` still overrides it.

`ShareModal` accepts `shareButtonLabel` and forwards it to the invite button.

`ShareModal` shows access requests passed through `accessRequests`, with `onAcceptAccessRequest`, `onRejectAccessRequest`, `hasNextAccessRequests`, and `onLoadNextAccessRequests`. A fourth generic, `AccessRequestType`, defaults to `object`, so existing call sites keep compiling.

`AccessRequestData` is exported next to `InvitationData`.

The link settings show one reach description under the reach and role row.

On a narrow screen, selected users stack one per line above the input, role, and invite button.
