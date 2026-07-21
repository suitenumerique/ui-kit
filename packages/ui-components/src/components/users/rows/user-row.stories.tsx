import type { Meta, StoryObj } from "@storybook/react";
import { UserRow } from "./UserRow";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/users/Row",
  component: UserRow,
  tags: ["autodocs"],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
} satisfies Meta<typeof UserRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fullName: "Gustave Eiffel",
    email: "gustave.eiffel@example.com",
    showEmail: true,
  },
};
