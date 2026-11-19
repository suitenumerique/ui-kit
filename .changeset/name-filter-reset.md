---
"@gouvfr-lasuite/ui-components": patch
---

Filter and SearchFilter: add a `resetLabel` prop to name the filter the reset
row clears, e.g. "Reset the type filter". It defaults to "Reset". The trigger
text of an inactive filter now uses the secondary content color, so it keeps a
4.5:1 contrast once hovered or focused. The SearchFilter list is now named
after the filter label only, without the arrow icon or the selected value.
