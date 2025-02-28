import type { Meta, StoryObj } from "@storybook/react";

import { Select } from "@openfun/cunningham-react";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Forms/Select",
  component: Select,
  tags: ["autodocs"],

  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const CITIES = [
  "Paris",
  "Marseille",
  "Lyon",
  "Toulouse",
  "Nice",
  "Nantes",
  "Strasbourg",
  "Montpellier",
  "Bordeaux",
  "Lille",
];
const OPTIONS = CITIES.map((city) => ({
  label: city,
  value: city.toLowerCase(),
}));

export const Uncontrolled: Story = {
  args: {
    label: "Select a city",
    options: OPTIONS,
    defaultValue: OPTIONS[4].value,
  },
};
