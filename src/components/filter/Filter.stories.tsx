import type { Meta, StoryObj } from "@storybook/react";

import { Filter } from "./Filter";
import { useState } from "react";
import { Key } from "react-aria-components";
import { Button, Option } from "@openfun/cunningham-react";

const meta: Meta<typeof Filter> = {
  title: "Components/Filter",
  component: Filter,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
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

const OPTIONS: Option[] = [
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

const OPTIONS_CUSTOM: Option[] = [
  {
    label: "All",
    render: () => (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
        <span className="material-icons">all_inclusive</span> All
      </div>
    ),
    value: "all",
  },
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
    render: () => (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
        <span className="material-icons">folder</span> Folder
      </div>
    ),
  },
];

export const Uncontrolled: Story = {
  args: {
    label: "Type",
    options: OPTIONS,
  },
};

export const UncontrolledWithDefault: Story = {
  args: {
    label: "Type",
    defaultSelectedKey: "folder",
    options: OPTIONS,
  },
};

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
          selectedKey={selected}
          onSelectionChange={(key) => {
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
                ].value as Key
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
