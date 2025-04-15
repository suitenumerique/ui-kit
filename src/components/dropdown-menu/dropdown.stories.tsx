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

const options = [
  {
    icon: <span className="material-icons">info</span>,
    label: "Informations",
    value: "info",
  },
  {
    icon: <span className="material-icons">group</span>,
    label: "Partager",
    callback: () => alert("Partager"),
  },
  {
    icon: <span className="material-icons">download</span>,
    label: "Télécharger",
    value: "download",
    showSeparator: true,
  },
  {
    icon: <span className="material-icons">edit</span>,
    label: "Renommer",
    value: "rename",
    showSeparator: true,
  },
  {
    icon: <span className="material-icons">arrow_forward</span>,
    label: "Déplacer",
    value: "move",
  },
  {
    icon: <span className="material-icons">arrow_back</span>,
    label: "Dupliquer",
    value: "duplicate",
  },
  {
    icon: <span className="material-icons">add</span>,
    isDisabled: true,
    label: "Crééer un raccourci",
    value: "create-shortcut",
    showSeparator: true,
  },
  {
    icon: <span className="material-icons">delete</span>,
    label: "Supprimer",
    value: "delete",
    showSeparator: true,
  },
];

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    options: options,
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

export const WithTopMessage: Story = {
  args: {
    options: [
      {
        label: "Administrator",
        value: "admin",
        isDisabled: true,
      },
      {
        label: "Editor",
        value: "editor",
        isDisabled: true,
      },
      {
        label: "Viewer",
        value: "viewer",
        isDisabled: true,
      },
    ],
    topMessage: "You don't have permission to modify these roles",
  },
  render: (args) => {
    const { isOpen, setIsOpen } = useDropdownMenu();
    const [selectedValues, setSelectedValues] = useState<string[]>(["info"]);
    return (
      <DropdownMenu
        {...args}
        onSelectValue={(value) => {
          setSelectedValues([value]);
        }}
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
