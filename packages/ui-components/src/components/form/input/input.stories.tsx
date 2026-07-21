import type { Meta, StoryObj } from "@storybook/react";

import { Input } from "@gouvfr-lasuite/cunningham-react";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Forms/Input",
  component: Input,
  tags: ["autodocs"],

  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: "Hello world",
    label: "Your name",
  },
};

export const Error = {
  args: {
    defaultValue: "Hello world",
    label: "Your name",
    state: "error",
    icon: <span className="material-icons">person</span>,
    text: "This is an optional error message",
  },
};

export const ErrorItems = {
  args: {
    defaultValue: "Hello world",
    label: "Your name",
    state: "error",
    icon: <span className="material-icons">person</span>,
    text: "This is an optional error message",
    textItems: [
      "Text too long",
      "Wrong choice",
      "Must contain at least 9 characters, uppercase and digits",
    ],
  },
};

export const DisabledEmpty = {
  args: {
    label: "Your name",
    icon: <span className="material-icons">person</span>,
    disabled: true,
  },
};

export const DisabledFilled = {
  args: {
    label: "Your name",
    defaultValue: "John Doe",
    icon: <span className="material-icons">person</span>,
    disabled: true,
  },
};

export const Empty = {
  args: {
    label: "Your email",
  },
};

export const Icon = {
  args: {
    label: "Account balance",
    icon: <span className="material-icons">attach_money</span>,
    defaultValue: "1000",
  },
};

export const IconRight = {
  args: {
    label: "Account balance",
    rightIcon: <span className="material-icons">attach_money</span>,
    defaultValue: "1000",
  },
};

export const FullWidth = {
  args: {
    defaultValue: "Hello world",
    label: "Your name",
    fullWidth: true,
    text: "This is a text, you can display anything you want here like warnings, informations or errors.",
    rightText: "0/300",
  },
};
