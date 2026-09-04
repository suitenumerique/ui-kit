---
"@gouvfr-lasuite/ui-components": patch
---

🐛(components) resolve the calendar hooks to a single react-aria copy

`useCalendarGrid` was imported from the `react-aria` umbrella while `useCalendarCell`
and `useCalendar` came from `@react-aria/calendar`. Those hooks exchange per-render
state through a `WeakMap` held in module scope, so in any consumer whose tree carries
two copies of the package the cell read a map the grid never wrote to and every click
on a date threw `Cannot destructure property 'ariaLabel'`.

The tree in this repository only ever resolves one copy, which is why the split was
invisible here. A lint rule now keeps the calendar and date picker hooks on their
scoped packages.
