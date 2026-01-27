/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@gouvfr-lasuite/cunningham-react";
import { useDropdownMenu } from ":/components/dropdown-menu/useDropdownMenu";
import { DropdownMenu } from ":/components/dropdown-menu/DropdownMenu";
import { DropdownMenuItem } from ":/components/dropdown-menu/types";
import { useState } from "react";

/**
 * The `DropdownMenu` component displays a menu when triggered by a button click.
 *
 * ## Basic usage
 *
 * ```tsx
 * import { DropdownMenu, useDropdownMenu } from "@gouvfr-lasuite/ui-kit";
 *
 * function MyComponent() {
 *   const { isOpen, setIsOpen } = useDropdownMenu();
 *
 *   const options: DropdownMenuItem[] = [
 *     { label: "Edit", icon: <EditIcon />, callback: () => edit() },
 *     { label: "Download", icon: <DownloadIcon />, callback: () => download() },
 *     { type: "separator" },
 *     { label: "Delete", icon: <TrashIcon />, callback: () => remove(), variant: "danger" },
 *   ];
 *
 *   return (
 *     <DropdownMenu options={options} isOpen={isOpen} onOpenChange={setIsOpen}>
 *       <Button onClick={() => setIsOpen(!isOpen)}>Actions</Button>
 *     </DropdownMenu>
 *   );
 * }
 * ```
 *
 * ## DropdownMenuItem props
 *
 * | Prop | Type | Description |
 * |------|------|-------------|
 * | `label` | `string` | Text displayed in the menu |
 * | `subText` | `string` | Secondary text below the label |
 * | `icon` | `ReactNode` | Icon displayed on the left |
 * | `callback` | `() => void` | Callback on click |
 * | `isDisabled` | `boolean` | Disables the item |
 * | `isHidden` | `boolean` | Hides the item |
 * | `variant` | `"default" \| "danger"` | Item style (danger = red) |
 * | `value` | `string` | Value for selection mode |
 * | `isChecked` | `boolean` | Shows a checkmark |
 *
 * For a separator: `{ type: "separator" }`
 *
 * ## Selection mode
 *
 * Use `selectedValues` and `onSelectValue` for single/multi-select behavior:
 *
 * ```tsx
 * const [selected, setSelected] = useState<string[]>(["option1"]);
 *
 * <DropdownMenu
 *   options={options}
 *   selectedValues={selected}
 *   onSelectValue={(value) => setSelected([value])}
 *   isOpen={isOpen}
 *   onOpenChange={setIsOpen}
 * >
 *   <Button>Select</Button>
 * </DropdownMenu>
 * ```
 *
 * ## Shared type with ContextMenu
 *
 * The `MenuItem` type is shared with `ContextMenu`, allowing you to define actions once
 * and use them in both components (e.g., "..." button and right-click menu).
 *
 * ```tsx
 * import { MenuItem, DropdownMenu, ContextMenu } from "@gouvfr-lasuite/ui-kit";
 *
 * const actions: MenuItem[] = [
 *   { label: "Open", callback: () => open() },
 *   { type: "separator" },
 *   { label: "Delete", callback: () => remove(), variant: "danger" },
 * ];
 *
 * // Same actions for both menus
 * <DropdownMenu options={actions} ... />
 * <ContextMenu options={actions} ... />
 * ```
 */
const meta = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  argTypes: {
    options: {
      description: "Menu items array (DropdownMenuItem[])",
      control: false,
    },
    isOpen: {
      description: "Controls whether the menu is open",
      control: "boolean",
    },
    onOpenChange: {
      description: "Callback when the menu opens or closes",
      control: false,
    },
    selectedValues: {
      description: "Array of selected values (for selection mode)",
      control: false,
    },
    onSelectValue: {
      description: "Callback when an item with a value is selected",
      control: false,
    },
    topMessage: {
      description: "Message displayed at the top of the menu",
      control: "text",
    },
    children: {
      description: "Trigger element (usually a button)",
      control: false,
    },
  },
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
