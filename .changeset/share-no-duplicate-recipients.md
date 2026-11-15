---
"@gouvfr-lasuite/ui-components": patch
---

ShareModal no longer offers the same recipient twice: a user picked by name is not offered again by email, emails are compared ignoring case, and members and pending invitations are not offered again. Users with an inherited access only can still be picked.
