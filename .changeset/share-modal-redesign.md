---
"@gouvfr-lasuite/ui-components": minor
---

💄(share) align the share modal with the sharing mockup

The user search result group is named "Select a user" by default. `searchGroupName` still overrides it.

`ShareModal` accepts `shareButtonLabel` and forwards it to the invite button.

An email that is not in the search results is listed with "Invite", and that action stays visible.

`ShareModal` shows access requests passed through `accessRequests`, with `onAcceptAccessRequest`, `onRejectAccessRequest`, `hasNextAccessRequests`, and `onLoadNextAccessRequests`. A fourth generic, `AccessRequestType`, defaults to `object`, so existing call sites keep compiling.

`AccessRequestData` is exported next to `AccessData`.

The link settings show one reach description under the reach and role row.

On a narrow screen, selected users stack one per line above the input, role, and invite button.

Accessibility:

- Section titles are level 3 headings, and `membersTitle` is rendered inside one.
- Role, remove, and "Show more" buttons name what they act on, for example "Change role for Alice Martin, currently Reader", "Remove Alice Martin", and "Show more members".
- A polite live region announces pending selection changes, role changes, and handled access requests.
- Focus returns to the search input after adding or removing a pending user.
- Decorative icons next to a text label are hidden from assistive technologies.
- Enter activates buttons and menus rendered inside `QuickSearch`, such as chip removal, request actions, and role menus. cmdk used to cancel it everywhere but in the search input.

Migration:

- Tests that query these buttons by their former names ("Reader", "Show more", the chip close button) need the new names.
- `.c__share-modal__link-settings__content__description.desktop` and `.mobile` are replaced by `.c__share-modal__link-settings__description`.
- Apps that relied on the former default search group name or on "Add" for unknown emails see the new wording; pass `searchGroupName` to keep a custom name.
