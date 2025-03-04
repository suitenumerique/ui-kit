/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@openfun/cunningham-react";
import { useDropdownMenu } from ":/components/dropdown-menu/useDropdownMenu";
import { DropdownMenu } from ":/components/dropdown-menu/DropdownMenu";
import { useState } from "react";

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
        value: "info",
      },
      { icon: "group", label: "Partager", value: "share" },
      {
        icon: "download",
        label: "Télécharger",
        value: "download",

        showSeparator: true,
      },
      {
        icon: "edit",
        label: "Renommer",
        value: "rename",

        showSeparator: true,
      },
      {
        icon: "arrow_forward",
        label: "Déplacer",
        value: "move",
      },
      {
        icon: "arrow_back",
        label: "Dupliquer",
        value: "duplicate",
      },
      {
        icon: "add",
        isDisabled: true,
        label: "Crééer un raccourci",
        value: "create-shortcut",
        showSeparator: true,
      },
      {
        icon: "delete",
        label: "Supprimer",
        value: "delete",
        showSeparator: true,
      },
    ],
  },
  render: (args) => {
    const { isOpen, setIsOpen } = useDropdownMenu();
    const [selectedValues, setSelectedValues] = useState<string[]>(["info"]);
    return (
      <DropdownMenu
        onSelectValue={(value) => {
          setSelectedValues([value]);
        }}
        options={args.options}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        selectedValues={selectedValues}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <Button onClick={() => setIsOpen(!isOpen)}>Open</Button>
        </div>
      </DropdownMenu>
    );
  },
};
