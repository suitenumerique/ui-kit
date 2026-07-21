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
    appSettingsCTA: () => {
      alert("Go to app settings");
    },
    settingsCTA: () => {
      alert("Go to account settings");
    },
    actions: <LanguagePicker languages={languages} size="nano" compact />,
    termOfServiceUrl,
    logout: () => {
      alert("You have been logged out!");
    },
  },
};

/**
 * Matches the refreshed design: compact identity, three menu actions and a
 * neutral footer inside a 272px popover.
 */
export const RefreshedExample: Story = {
  args: {
    user: {
      full_name: "Amandine Salambo",
      email: "amandine.salambo@numerique.gouv.fr",
    },
    appSettingsCTA: () => {
      alert("Go to app settings");
    },
    settingsCTA: () => {
      alert("Go to account settings");
    },
    logout: () => {
      alert("You have been logged out!");
    },
    actions: <LanguagePicker languages={languages} size="nano" compact />,
    termOfServiceUrl,
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
      <LanguagePicker languages={languages} size="nano" fullWidth compact />
    ),
  },
};
export const WithOnlyTermOfService: Story = {
  args: {
    user: {
      full_name: "J Doe",
      email: "john.doe@example.com",
    },
    termOfServiceUrl,
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

export const WithNoMobileView: Story = {
  args: {
    user: {
      email: "jane.doe@example.com",
    },
    withMobileView: false,
  },
};

export const WithLotOfSettings: Story = {
  args: {
    user: {
      full_name: "J Doe",
      email: "john.doe@example.com",
    },
    logout: () => {
      alert("You have been logged out!");
    },
    settingsCTA: () => {
      alert("Go to account settings");
    },
    actions: (
      <LanguagePicker languages={languages} size="nano" fullWidth compact />
    ),
    termOfServiceUrl,
  },
};
