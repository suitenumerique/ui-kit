/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@openfun/cunningham-react";
import { useDropdownMenu } from ":/components/dropdown-menu/useDropdownMenu";
import { DropdownMenu } from ":/components/dropdown-menu/DropdownMenu";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    options: [
      {
        icon: "info",
        label: "Informations",
        callback: () => alert("Informations"),
      },
      { icon: "group", label: "Partager", callback: () => alert("Partager") },
      {
        icon: "download",
        label: "Télécharger",
        callback: () => alert("Télécharger"),
        showSeparator: true,
      },
      {
        icon: "edit",
        label: "Renommer",
        callback: () => alert("Renommer"),
        isChecked: true,
        showSeparator: true,
      },
      {
        icon: "arrow_forward",
        label: "Déplacer",
        callback: () => alert("Déplacer"),
      },
      {
        icon: "arrow_back",
        label: "Dupliquer",
        callback: () => alert("Dupliquer"),
      },
      {
        icon: "add",
        isDisabled: true,
        label: "Crééer un raccourci",
        callback: () => alert("Crééer un raccourci"),
        showSeparator: true,
      },
      {
        icon: "delete",
        label: "Supprimer",
        callback: () => alert("Supprimer"),
        showSeparator: true,
      },
    ],
  },
  render: (args) => {
    const { isOpen, setIsOpen } = useDropdownMenu();
    return (
      <DropdownMenu
        options={args.options}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <Button onClick={() => setIsOpen(!isOpen)}>Open</Button>
      </DropdownMenu>
    );
  },
};
