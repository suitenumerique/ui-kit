
import { Meta, StoryObj } from "@storybook/react";
import { LanguagePicker } from "./language-picker";

const meta: Meta<typeof LanguagePicker> = {
    title: "Components/LanguagePicker",
    component: LanguagePicker,
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const languages = [
    { label: "Français", value: "fr-FR" },
    { label: "English", value: "en-US" },
    { label: "German", value: "de-DE" },
];

export const Default: Story = {
    args: {
        languages,
        onChange: (value) => {
            alert(`Language changed to ${languages.find((lang) => lang.value === value)?.label}`);
        },
    },
};
