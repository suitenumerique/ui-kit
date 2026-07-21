import type { Meta, StoryFn, StoryObj } from "@storybook/react";

import { WithLabel } from "./WithLabel";
import { DropdownMenu } from ":/components/dropdown-menu/DropdownMenu";
import { Button } from "@gouvfr-lasuite/cunningham-react";
import { useState } from "react";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Forms/WithLabel",
  component: WithLabel,
  tags: ["autodocs"],

  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
} satisfies Meta<typeof WithLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template: StoryFn<typeof WithLabel> = (args) => {
  const [open, setOpen] = useState(false);
  return (
    <WithLabel {...args} aria-label="WithLabel">
      <DropdownMenu
        isOpen={open}
        onOpenChange={setOpen}
        options={[
          { label: "Option 1" },
          { label: "Option 2" },
          { label: "Option 3" },
        ]}
      >
        <Button
          icon={
            <span className="material-icons">
              {open ? "arrow_drop_up" : "arrow_drop_down"}
            </span>
          }
          variant="tertiary"
          size="small"
          iconPosition="right"
          onClick={() => setOpen(true)}
        >
          Dropdown
        </Button>
      </DropdownMenu>
    </WithLabel>
  );
};

export const Default: Story = {
  render: Template,
  args: {
    label: "Label",
    labelSide: "left",
    text: "Description liée à ce label sur plusieurs lignes",
  },
};

export const Right: Story = {
  render: Template,
  args: {
    label: "Label",
    labelSide: "right",
    text: "Description liée à ce label sur plusieurs lignes",
  },
};
