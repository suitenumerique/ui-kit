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
 * | `withSlots` | `boolean` | Inside a `MenuItem` / `ListBoxItem`: names the item by the label and describes it by the sub text |
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
