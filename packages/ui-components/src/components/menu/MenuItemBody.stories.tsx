import type { Meta, StoryObj } from "@storybook/react";

import { ReactNode } from "react";
import { MenuItemBody } from "./MenuItemBody";
import { Icon, IconSize } from "../icon";

/**
 * `MenuItemBody` is the presentational inner content shared by every menu row:
 * `DropdownMenu`, `ContextMenu`, `Filter` and `SearchFilter`. It is
 * **role-agnostic** — it emits only children (icon, label, optional sub text,
 * shortcut and a trailing check/chevron) and is meant to be rendered *inside* a
 * react-aria `MenuItem` or `ListBoxItem`, or a plain element, carrying the
 * `c__dropdown-menu-item` class that styles it.
 *
 * You normally never render it directly — the menu components do that for you.
 * These stories wrap it in the `c__dropdown-menu` / `c__dropdown-menu-item`
 * markup so the layout matches what you get inside a real menu.
 *
 * ## Props
 *
 * | Prop | Type | Description |
 * |------|------|-------------|
 * | `icon` | `ReactNode` | Decorative icon on the left, hidden from assistive technologies |
 * | `label` | `ReactNode` | Main label content |
 * | `subText` | `ReactNode` | Secondary text rendered below the label |
 * | `shortcut` | `string` | Keyboard shortcut displayed at the end of the row |
 * | `isChecked` | `boolean` | Renders the trailing check icon |
 * | `hasSubmenu` | `boolean` | Renders the trailing chevron (takes precedence over the check) |
 * | `opensInNewWindow` | `boolean` | Appends a visually hidden "(new window)" hint to the label |
 * | `withSlots` | `boolean` | `true` by default: renders the label, sub text and shortcut in React Aria's text slots. See below |
 *
 * ## `withSlots`: React Aria text slots
 *
 * A React Aria `MenuItem` or `ListBoxItem` takes its accessible name from the
 * text in its `label` slot, and its description from the text in its
 * `description` slot and its `Keyboard` shortcut. With `withSlots` (the
 * default), `MenuItemBody` fills those slots:
 *
 * - the label, with the "(new window)" hint, in `<Text slot="label">`;
 * - the sub text in `<Text slot="description">`;
 * - the shortcut in `<Keyboard>`.
 *
 * A screen reader then announces *"Duplicate, menu item, Make a copy ⌘D"*:
 * a short name, then the details as a description. With
 * `withSlots={false}`, the label, sub text and shortcut are plain text, so
 * the whole row becomes the name: *"Duplicate Make a copy ⌘D, menu item"*.
 *
 * | Where `MenuItemBody` renders | `withSlots` |
 * |------|------|
 * | Inside a `MenuItem` or `ListBoxItem`: `DropdownMenu` and `ContextMenu` items, `Filter` options, the `renderItem` of `SearchFilter` | Keep the default (`true`) |
 * | Where React Aria defines no text slot: plain DOM such as a `<button>` or a `<div>` (as in the stories of this page), or the popover of a `Select` or `ComboBox`, which clears the slots of its field | Either value: the slots have no effect, the text renders as is |
 * | Inside a React Aria component that defines text slots without `label`: a form field (`TextField`, `SearchField`, `NumberField`, `Select`, `ComboBox`, `RadioGroup`, `Checkbox`, `DateField`, `DatePicker`) outside its popover, or a `GridListItem`, `TreeItem`, `Table` row or `TagGroup` | `false` (required) |
 *
 * The last case is required because React Aria only accepts the slots the
 * enclosing component defines. Form fields define `description` and
 * `errorMessage`; grid list, tree and table items define a default slot (and
 * `description` for grid lists). A `label` slot does not exist there, so
 * React Aria throws while rendering, for instance in a form field:
 *
 * ```
 * Invalid slot "label". Valid slot names are "description" and "errorMessage".
 * ```
 *
 * ```tsx
 * // A row of a GridList: its items have no label slot.
 * <GridListItem textValue={file.name}>
 *   <MenuItemBody withSlots={false} icon={<FileIcon />} label={file.name} />
 * </GridListItem>
 * ```
 */
const meta = {
  title: "Components/MenuItemBody",
  component: MenuItemBody,
  tags: ["autodocs"],
  argTypes: {
    icon: { control: false, description: "Icon displayed on the left" },
    label: { control: "text", description: "Main label content" },
    subText: { control: "text", description: "Secondary text below the label" },
    shortcut: {
      control: "text",
      description: "Keyboard shortcut displayed at the end of the row",
    },
    isChecked: {
      control: "boolean",
      description: "Renders the trailing check icon",
    },
    hasSubmenu: {
      control: "boolean",
      description: "Renders the trailing chevron (takes precedence over check)",
    },
    withSlots: {
      control: "boolean",
      description:
        "Renders the label, sub text and shortcut in React Aria's text slots, so a MenuItem or ListBoxItem is named by the label and described by the rest. Set it to false inside a React Aria component whose text slots have no label (a form field outside its popover, a GridList, Tree or Table item, a TagGroup), where React Aria would throw.",
      table: { defaultValue: { summary: "true" } },
    },
  },
} satisfies Meta<typeof MenuItemBody>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Wraps children in the menu container markup that styles `MenuItemBody`. */
const MenuPreview = ({ children }: { children: ReactNode }) => (
  <div className="c__dropdown-menu" style={{ width: 240 }}>
    {children}
  </div>
);

/** A single styled menu row, mimicking what `MenuItem`/`ListBoxItem` provide. */
const MenuRow = ({
  children,
  danger,
}: {
  children: ReactNode;
  danger?: boolean;
}) => (
  <div
    className={`c__dropdown-menu-item${
      danger ? " c__dropdown-menu-item--danger" : ""
    }`}
  >
    {children}
  </div>
);

const icon = (name: string) => <Icon name={name} size={IconSize.SMALL} />;

export const Default: Story = {
  args: {
    icon: icon("info"),
    label: "Information",
  },
  render: (args) => (
    <MenuPreview>
      <MenuRow>
        <MenuItemBody {...args} />
      </MenuRow>
    </MenuPreview>
  ),
};

/** A secondary line of text rendered below the label. */
export const WithSubText: Story = {
  args: {
    icon: icon("group"),
    label: "Share",
    subText: "Can share and manage access",
  },
  render: Default.render,
};

/** `isChecked` renders the trailing check icon, used for selection state. */
export const Checked: Story = {
  args: {
    icon: icon("visibility"),
    label: "Viewer",
    isChecked: true,
  },
  render: Default.render,
};

/** `hasSubmenu` renders the trailing chevron and takes precedence over the check. */
export const WithSubmenu: Story = {
  args: {
    icon: icon("share"),
    label: "Share",
    hasSubmenu: true,
  },
  render: Default.render,
};

/** Without an `icon`, the icon slot is omitted and the label aligns to the padding. */
export const WithoutIcon: Story = {
  args: {
    label: "Rename",
  },
  render: Default.render,
};

/**
 * The danger styling comes from the `c__dropdown-menu-item--danger` row class
 * (set by the menu components), not from `MenuItemBody` itself.
 */
export const Danger: Story = {
  args: {
    icon: icon("delete"),
    label: "Delete",
  },
  render: (args) => (
    <MenuPreview>
      <MenuRow danger>
        <MenuItemBody {...args} />
      </MenuRow>
    </MenuPreview>
  ),
};

/** Several rows together, showing how the variants line up inside a menu. */
export const Gallery: Story = {
  args: { label: "" },
  render: () => (
    <MenuPreview>
      <MenuRow>
        <MenuItemBody icon={icon("open_in_new")} label="Open" />
      </MenuRow>
      <MenuRow>
        <MenuItemBody
          icon={icon("group")}
          label="Share"
          subText="Can share and manage access"
        />
      </MenuRow>
      <MenuRow>
        <MenuItemBody icon={icon("visibility")} label="Viewer" isChecked />
      </MenuRow>
      <MenuRow>
        <MenuItemBody
          icon={icon("drive_file_move")}
          label="Move to"
          hasSubmenu
        />
      </MenuRow>
      <MenuRow>
        <MenuItemBody label="Rename" shortcut="F2" />
      </MenuRow>
      <MenuRow danger>
        <MenuItemBody icon={icon("delete")} label="Delete" />
      </MenuRow>
    </MenuPreview>
  ),
};
