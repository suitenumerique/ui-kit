/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@gouvfr-lasuite/cunningham-react";
import { useDropdownMenu } from ":/components/dropdown-menu/useDropdownMenu";
import { DropdownMenu } from ":/components/dropdown-menu/DropdownMenu";
import { DropdownMenuItem } from ":/components/dropdown-menu/types";
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
    subText: "Can view and edit content",
    value: "info",
  },
  {
    icon: <span className="material-icons">group</span>,
    label: "Partager",
    subText: "Can share and manage accessdx",
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

/**
 * Using separator items and danger variant.
 * The `{ type: "separator" }` item creates a visual divider between menu sections.
 * The `variant: "danger"` makes the item red for destructive actions.
 */
const optionsWithSeparators: DropdownMenuItem[] = [
  {
    icon: <span className="material-icons">open_in_new</span>,
    label: "Ouvrir",
    callback: () => alert("Ouvrir"),
  },
  {
    icon: <span className="material-icons">download</span>,
    label: "Télécharger",
    callback: () => alert("Télécharger"),
  },
  { type: "separator" },
  {
    icon: <span className="material-icons">edit</span>,
    label: "Renommer",
    callback: () => alert("Renommer"),
  },
  {
    icon: <span className="material-icons">content_copy</span>,
    label: "Dupliquer",
    callback: () => alert("Dupliquer"),
  },
  { type: "separator" },
  {
    icon: <span className="material-icons">delete</span>,
    label: "Supprimer",
    callback: () => alert("Supprimer"),
    variant: "danger",
  },
];

export const WithSeparatorsAndDanger: Story = {
  args: {
    options: optionsWithSeparators,
  },
  render: (args) => {
    const { isOpen, setIsOpen } = useDropdownMenu();
    return (
      <DropdownMenu
        options={args.options}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      >
        <Button onClick={() => setIsOpen(!isOpen)}>Actions</Button>
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
