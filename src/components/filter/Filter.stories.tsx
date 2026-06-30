import type { Meta, StoryObj } from "@storybook/react";

import { Filter, FilterOption } from "./Filter";
import { useState } from "react";
import { Key } from "react-aria-components";
import { Button, CalendarRange } from "@gouvfr-lasuite/cunningham-react";
import { DateValue } from "@internationalized/date";

/**
 * The `Filter` component is a single-select dropdown built on react-aria's
 * `Select`. It renders a labelled trigger button that reflects the current
 * selection (`label : value`) and opens a list of options in a popover. It is
 * meant for the inline, toolbar-style filters you place above a list or table.
 *
 * Highlights:
 *
 * - **Controlled or uncontrolled.** Use `defaultValue` to let the
 *   component own its state, or `value` + `onChange` to drive it
 *   from your own state.
 * - **Custom option rendering.** Each option can supply a `render` function to
 *   display icons or richer content instead of a plain label.
 * - **Separators.** Set `showSeparator` on an option to draw a divider after it.
 * - **Sub-panels.** An option can expose a `subContent` panel (e.g. a date-range
 *   picker) that opens on hover, with `select` / `close` helpers to drive the
 *   parent selection.
 *
 * ## Basic usage
 *
 * ```tsx
 * import { Filter, FilterOption } from "@gouvfr-lasuite/ui-kit";
 *
 * const options: FilterOption[] = [
 *   { label: "All", value: "all" },
 *   { label: "File", value: "file" },
 *   { label: "Folder", value: "folder" },
 * ];
 *
 * export const MyFilter = () => (
 *   <Filter label="Type" options={options} defaultValue="file" />
 * );
 * ```
 *
 * ## `FilterProps`
 *
 * `FilterProps` extends react-aria's `SelectProps`, so every selection-related
 * prop (`value`, `defaultValue`, `onChange`,
 * `isDisabled`, …) is available in addition to the props below.
 *
 * | Prop | Type | Description |
 * |------|------|-------------|
 * | `label` | `string` | Text shown on the trigger button; combined with the selected option's label once a value is picked |
 * | `options` | `FilterOption[]` | The selectable entries |
 * | `defaultValue` | `Key \| null?` | Initial selection in uncontrolled mode |
 * | `value` | `Key \| null?` | Selected value in controlled mode |
 * | `onChange` | `(key: Key \| null) => void` | Fires when the user picks an option |
 *
 * ## `FilterOption`
 *
 * `FilterOption` extends Cunningham's `Option` (`label`, `value`, `render`, …).
 *
 * | Property | Type | Description |
 * |----------|------|-------------|
 * | `label` | `string` | Text shown in the row and in the trigger when selected |
 * | `value` | `string` | Stable key used for selection |
 * | `render` | `() => ReactNode` | Custom row content (e.g. an icon + label) |
 * | `showSeparator` | `boolean?` | Draw a divider after this option |
 * | `isChecked` | `boolean?` | Force the checkmark on this row |
 * | `subContent` | `(helpers) => ReactNode` | Render a hover sub-panel; `helpers` exposes `select()` and `close()` |
 */
const meta: Meta<typeof Filter> = {
  title: "Components/Filter",
  component: Filter,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    label: {
      description:
        "Text shown on the trigger button; combined with the selected option's label once a value is picked",
      control: "text",
    },
    options: {
      description: "The selectable entries",
      control: false,
    },
    defaultValue: {
      description: "Initial selection in uncontrolled mode",
      control: "text",
    },
    value: {
      description: "Selected value in controlled mode",
      control: false,
    },
    onChange: {
      description: "Fires when the user picks an option",
      control: false,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "3em" }}>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it  */}
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const OPTIONS: FilterOption[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "File",
    value: "file",
  },
  {
    label: "Folder",
    value: "folder",
  },
];

const OPTIONS_CUSTOM: FilterOption[] = [
  {
    label: "File",
    render: () => (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
        <span className="material-icons">file_present</span> File
      </div>
    ),
    value: "file",
  },
  {
    label: "Folder",
    value: "folder",
    showSeparator: true,

    render: () => (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
        <span className="material-icons">folder</span> Folder
      </div>
    ),
  },
  {
    label: "Reset",
    render: () => (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
        <span className="material-icons">all_inclusive</span> All
      </div>
    ),
    value: "all",
  },
];

/**
 * The simplest setup: the component manages its own selection state. Nothing is
 * selected on first render, so the trigger shows just the `label`. Picking an
 * option updates the button to read `Type : <option>`.
 */
export const Uncontrolled: Story = {
  args: {
    label: "Type",
    options: OPTIONS,
  },
};

/**
 * Same uncontrolled behaviour, but `defaultValue` preselects an option on
 * mount. The trigger renders in its active state and the matching row shows a
 * checkmark from the start.
 */
export const UncontrolledWithDefault: Story = {
  args: {
    label: "Type",
    defaultValue: "folder",
    options: OPTIONS,
  },
};

const OPTIONS_LONG: FilterOption[] = [
  {
    label: "All available documents",
    value: "all",
  },
  {
    label: "Files shared with my team",
    value: "file",
  },
  {
    label: "Folders recently modified by a collaborator",
    value: "folder",
  },
];

/**
 * Demonstrates how the component copes with long text in both the trigger label
 * and the option rows. Labels wrap / truncate gracefully so the filter stays
 * usable even with verbose content.
 */
export const LongLabels: Story = {
  args: {
    label: "Type of content to display in the list",
    options: OPTIONS_LONG,
  },
};

/**
 * Several filters laid out side by side in a width-constrained, horizontally
 * scrollable toolbar — the typical "filter bar" above a list. Shows that the
 * triggers keep their sizing and the popovers position correctly in a cramped
 * layout.
 */
export const MultipleInConstrainedContainer: Story = {
  render: () => (
    <div
      style={{
        maxWidth: "600px",
        border: "1px solid #ccc",
        padding: "1em",
        display: "flex",
        gap: "1em",
        alignItems: "center",
        overflowX: "auto",
      }}
    >
      <Filter
        label="Type of content to display"
        defaultValue="folder"
        options={[
          { label: "Shared folder with the team", value: "folder" },
          { label: "Recently modified file", value: "file" },
        ]}
      />
      <Filter
        label="Collaborative Workspace"
        defaultValue="public"
        options={[
          { label: "Public workspace accessible to all", value: "public" },
          { label: "Private workspace reserved for members", value: "private" },
        ]}
      />
      <Filter
        label="Document location in the hierarchy"
        defaultValue="trash"
        options={[
          { label: "Deleted items trash", value: "trash" },
          { label: "User-marked favorites", value: "favorites" },
        ]}
      />
      <Button size="small">Reset</Button>
    </div>
  ),
};

/**
 * Controlled mode: the parent owns the selection via `value` +
 * `onChange`. This example also uses `OPTIONS_CUSTOM`, so each row is
 * drawn with a `render` function (icon + label), and treats the "All" option as
 * a reset by clearing the selection. The Reset / Random buttons show that the
 * trigger always reflects the externally-driven state.
 */
export const Controlled: Story = {
  args: {
    label: "Type",
    options: OPTIONS_CUSTOM,
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selected, setSelected] = useState<Key | null>("folder");
    return (
      <div>
        <Filter
          {...args}
          value={selected}
          onChange={(key) => {
            if (key === "all") {
              setSelected(null);
            } else {
              setSelected(key);
            }
          }}
        />
        <div style={{ display: "flex", gap: "1em", marginTop: "1em" }}>
          <Button size="small" onClick={() => setSelected(null)}>
            Reset
          </Button>
          <Button
            size="small"
            onClick={() =>
              setSelected(
                OPTIONS_CUSTOM[
                  Math.floor(Math.random() * OPTIONS_CUSTOM.length)
                ].value as Key,
              )
            }
          >
            Random
          </Button>
        </div>
      </div>
    );
  },
};

type DateRangeValue = { start: DateValue; end: DateValue };

const formatRange = (range: DateRangeValue) =>
  `${range.start.toString()} – ${range.end.toString()}`;

/**
 * A filter whose last option ("Custom") declares a `subContent` panel. The row
 * renders with a chevron and, on hover, opens a sub-panel hosting a
 * `CalendarRange` date picker.
 *
 * The `subContent` callback receives two helpers:
 *
 * - `select()` — sets the Filter's selected key to this option's value.
 * - `close()` — closes the sub-panel and the Filter popover.
 *
 * Here, confirming the calendar (`onOk`) calls both to commit the range and
 * dismiss the menu, while the option's `label` is rewritten to show the chosen
 * range. Cancelling just closes the panel.
 */
export const UpdatedWithDateRange: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selected, setSelected] = useState<Key | null>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
    );
  },
};
