import { useState } from "react";
import { Key } from "react-aria-components";
import { Button, CalendarRange } from "@gouvfr-lasuite/cunningham-react";
import { DateValue } from "@internationalized/date";
import { CunninghamProvider } from "../../src/components/Provider/Provider";
import { Filter, FilterOption } from "../../src/components/filter/Filter";

// Playwright CT bridges function props as one-way dispatchers whose return
// value is always `undefined`, so render props (`subContent`) can't be passed
// from the test file. This helper runs in the browser and builds the actual
// stateful scenario locally, mirroring the `UpdatedWithDateRange` story.

type DateRangeValue = { start: DateValue; end: DateValue };

const formatRange = (range: DateRangeValue) =>
  `${range.start.toString()} – ${range.end.toString()}`;

export const TestFilter = () => {
  const [selected, setSelected] = useState<Key | null>(null);
  const [range, setRange] = useState<DateRangeValue | null>(null);

  const reset = () => {
    setSelected(null);
    setRange(null);
  };

  const options: FilterOption[] = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last week", value: "lastWeek", showSeparator: true },
    {
      label: range ? formatRange(range) : "Custom",
      value: "custom",
      subContent: ({ select, close }) => (
        <CalendarRange
          value={range}
          onChange={setRange}
          onOk={() => {
            select();
            close();
          }}
          onCancel={close}
        />
      ),
    },
  ];

  return (
    <CunninghamProvider currentLocale="en-US">
      <div style={{ display: "flex", gap: "1em", alignItems: "center" }}>
        <Filter
          label="Updated"
          options={options}
          value={selected}
          onChange={setSelected}
        />
        <Button size="small" onClick={reset}>
          Reset
        </Button>
      </div>
    </CunninghamProvider>
  );
};

// Minimal Filter used to exercise the built-in reset row (`showReset`). Kept
// separate from `TestFilter` so there is no external "Reset" button to collide
// with the reset row's label.
export const TestResetFilter = ({ showReset }: { showReset?: boolean }) => {
  const [selected, setSelected] = useState<Key | null>(null);

  const options: FilterOption[] = [
    { label: "All", value: "all" },
    { label: "File", value: "file" },
    { label: "Folder", value: "folder" },
  ];

  return (
    <CunninghamProvider currentLocale="en-US">
      <Filter
        label="Type"
        options={options}
        value={selected}
        onChange={setSelected}
        showReset={showReset}
      />
    </CunninghamProvider>
  );
};
