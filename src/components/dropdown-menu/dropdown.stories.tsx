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
    label: "Information",
    subText: "Can view and edit content",
    value: "info",
  },
  {
    icon: <span className="material-icons">group</span>,
    label: "Share",
    subText: "Can share and manage access",
    callback: () => alert("Share"),
  },
  {
    icon: <span className="material-icons">download</span>,
    label: "Download",
    value: "download",
    showSeparator: true,
  },
  {
    icon: <span className="material-icons">edit</span>,
    label: "Rename",
    value: "rename",
    showSeparator: true,
  },
  {
    icon: <span className="material-icons">arrow_forward</span>,
    label: "Move",
    value: "move",
  },
  {
    icon: <span className="material-icons">arrow_back</span>,
    label: "Duplicate",
    value: "duplicate",
  },
  {
    icon: <span className="material-icons">add</span>,
    isDisabled: true,
    label: "Create shortcut",
    value: "create-shortcut",
    showSeparator: true,
  },
  {
    icon: <span className="material-icons">delete</span>,
    label: "Delete",
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
    label: "Open",
    callback: () => alert("Open"),
  },
  {
    icon: <span className="material-icons">download</span>,
    label: "Download",
    callback: () => alert("Download"),
  },
  { type: "separator" },
  {
    icon: <span className="material-icons">edit</span>,
    label: "Rename",
    callback: () => alert("Rename"),
  },
  {
    icon: <span className="material-icons">content_copy</span>,
    label: "Duplicate",
    callback: () => alert("Duplicate"),
  },
  { type: "separator" },
  {
    icon: <span className="material-icons">delete</span>,
    label: "Delete",
    callback: () => alert("Delete"),
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

const optionsWithSubmenus: DropdownMenuItem[] = [
  {
    icon: <span className="material-icons">open_in_new</span>,
    label: "Open",
    callback: () => alert("Open"),
  },
  {
    icon: <span className="material-icons">share</span>,
    label: "Share",
    children: [
      {
        icon: <span className="material-icons">email</span>,
        label: "Email",
        callback: () => alert("Email"),
      },
      {
        icon: <span className="material-icons">sms</span>,
        label: "SMS",
        callback: () => alert("SMS"),
      },
      {
        icon: <span className="material-icons">link</span>,
        label: "Copy link",
        callback: () => alert("Link copied"),
      },
    ],
  },
  { type: "separator" },
  {
    icon: <span className="material-icons">drive_file_move</span>,
    label: "Move to",
    children: [
      {
        icon: <span className="material-icons">folder</span>,
        label: "Documents",
        callback: () => alert("Documents"),
      },
      {
        icon: <span className="material-icons">folder</span>,
        label: "Archives",
        children: [
          {
            label: "2024",
            callback: () => alert("Archives 2024"),
          },
          {
            label: "2025",
            callback: () => alert("Archives 2025"),
          },
        ],
      },
    ],
  },
  { type: "separator" },
  {
    icon: <span className="material-icons">delete</span>,
    label: "Delete",
    callback: () => alert("Delete"),
    variant: "danger",
  },
];

/**
 * Demonstrates nested submenus. Items with a `children` array automatically
 * become submenu triggers with a chevron icon. Supports unlimited nesting depth.
 */
export const WithSubmenus: Story = {
  args: {
    options: optionsWithSubmenus,
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

/**
 * The `tiny` variant renders a more compact menu with smaller items, icons, and padding.
 */
export const Tiny: Story = {
  args: {
    options: optionsWithSeparators,
    variant: "tiny",
  },
  render: (args) => {
    const { isOpen, setIsOpen } = useDropdownMenu();
    return (
      <DropdownMenu
        options={args.options}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        variant={args.variant}
      >
        <Button onClick={() => setIsOpen(!isOpen)}>Actions</Button>
      </DropdownMenu>
    );
  },
};

/**
 * The `tiny` variant with nested submenus.
 */
export const TinyWithSubmenus: Story = {
  args: {
    options: optionsWithSubmenus,
    variant: "tiny",
  },
  render: (args) => {
    const { isOpen, setIsOpen } = useDropdownMenu();
    return (
      <DropdownMenu
        options={args.options}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        variant={args.variant}
      >
        <Button onClick={() => setIsOpen(!isOpen)}>Actions</Button>
      </DropdownMenu>
    );
  },
};

/**
 * Trigger placed at the right edge of the viewport to test submenu collision handling.
 * Submenus should flip or shift to stay within the viewport bounds.
 */
export const SubmenuAtEdge: Story = {
  args: {
    options: optionsWithSubmenus,
  },
  render: (args) => {
    const { isOpen, setIsOpen } = useDropdownMenu();
    return (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <DropdownMenu
          options={args.options}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          <Button onClick={() => setIsOpen(!isOpen)}>Actions</Button>
        </DropdownMenu>
      </div>
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
