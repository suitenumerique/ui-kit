import { Meta, StoryObj } from "@storybook/react";
import { LanguagePicker } from ":/components/language";
import { UserMenu } from ".";

const meta: Meta<typeof UserMenu> = {
  title: "Components/users/Menu",
  component: UserMenu,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const languages = [
  { label: "Français", value: "fr-FR" },
  { label: "English", value: "en-US" },
  { label: "Deutsch", value: "de-DE" },
];

export const Default: Story = {
  args: {
    user: {
      full_name: "John Doe",
      email: "john.doe@example.com",
    },
    settingsCTA: () => {
      alert("Go to account settings");
    },
    footerAction: (
      <LanguagePicker
        languages={languages}
        size="small"
        variant="bordered"
        fullWidth
      />
    ),
    logout: () => {
      alert("You have been logged out!");
    },
  },
};

export const WithOnlyLogout: Story = {
  args: {
    user: {
      full_name: "J Doe",
      email: "john.doe@example.com",
    },
    logout: () => {
      alert("You have been logged out!");
    },
  },
};
export const WithOnlyFooterAction: Story = {
  args: {
    user: {
      full_name: "J Doe",
      email: "john.doe@example.com",
    },
    footerAction: (
      <LanguagePicker
        languages={languages}
        size="small"
        variant="bordered"
        fullWidth
      />
    ),
  },
};

export const Minimal: Story = {
  args: {
    user: {
      full_name: "Jean Martin",
      email: "jean.martin@example.com",
    },
  },
};

export const WithNoFullName: Story = {
  args: {
    user: {
      email: "jane.doe@example.com",
    },
  },
};
