---
"@gouvfr-lasuite/ui-components": minor
---

Allow consumers to extend the ShareModal access rows

Some consumers need to attach their own actions and information to a member row.
`renderAccessRightExtras` adds content on the right of a row, inline with the role
dropdown, `renderAccessFooter` renders content directly below a row, and
`getAccessClassName` flags a row so CSS can decorate it. `membersTitle` overrides the
default "N members" heading and `searchGroupName` the search results heading.

Inviting by email does not always make sense, so `allowInvitation={false}` now restricts
the selection to the users returned by `onSearchUsers`.
