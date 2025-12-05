import { Meta, StoryObj } from "@storybook/react";
import { LanguagePicker, LanguagesOption } from ":/components/language";
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

const languages: LanguagesOption[] = [
  { label: "Français", value: "fr-FR", shortLabel: "FR" },
  { label: "English", value: "en-US", shortLabel: "EN" },
  { label: "Deutsch", value: "de-DE", shortLabel: "DE" },
];

const termOfServiceUrl =
  "https://docs.numerique.gouv.fr/docs/8e298e03-c95f-44c7-be4a-ffb618af1854/";

export const Default: Story = {
  args: {
    user: {
      full_name: "John Doe",
      email: "john.doe@example.com",
    },
    settingsCTA: () => {
      alert("Go to account settings");
    },
    actions: <LanguagePicker languages={languages} size="small" compact />,
    termOfServiceUrl,
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
    actions: (
      <LanguagePicker languages={languages} size="small" fullWidth compact />
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
