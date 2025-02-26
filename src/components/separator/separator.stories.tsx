import type { Meta, StoryObj } from "@storybook/react";

import { HorizontalSeparator } from "./HorizontalSeparator";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Separator",
  component: HorizontalSeparator,
  tags: ["autodocs"],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
} satisfies Meta<typeof HorizontalSeparator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithPadding: Story = {
  render: () => {
    return (
      <div>
        <div>Up</div>
        <HorizontalSeparator withPadding />
        <div>Down</div>
      </div>
    );
  },
};

export const WithoutPadding: Story = {
  render: () => {
    return (
      <div>
        <div>Content</div>
        <HorizontalSeparator withPadding={false} />
        <div>Content</div>
      </div>
    );
  },
};
