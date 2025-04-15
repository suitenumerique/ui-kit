import type { Meta, StoryObj } from "@storybook/react";
import { UserAvatar } from "./UserAvatar";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/users/Avatar",
  component: UserAvatar,
  tags: ["autodocs"],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
} satisfies Meta<typeof UserAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const XSmall: Story = {
  args: {
    fullName: "Gustave Eiffel",
    size: "xsmall",
  },
};

export const Small: Story = {
  args: {
    fullName: "Jules Verne",
    size: "small",
  },
};
export const Medium: Story = {
  args: {
    fullName: "John Doe",
    size: "medium",
  },
};

export const Large: Story = {
  args: {
    fullName: "Albert Einstein",
    size: "large",
  },
};

export const ComplexName: Story = {
  args: {
    fullName: "Jean-Philippe De La Rozière",
    size: "large",
  },
};
