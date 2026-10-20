import { forwardRef, HTMLAttributes, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button as AriaButton } from "react-aria-components";
import { Button } from ":/components/button";
import { DropdownMenu } from ":/components/dropdown-menu";
import { Tooltip } from ":/components/tooltip";
import { UserAvatar } from ":/components/users/avatar";
import {
  ChevronDown,
  Copy,
  Download,
  Edit,
  Logout,
  More,
  Settings,
  Share,
  Trash,
  User,
} from ":/icons";
import { DropdownMenuV2 } from "./DropdownMenuV2";
import { DropdownMenuV2Popover } from "./DropdownMenuV2Popover";
import { DropdownMenuV2Trigger } from "./DropdownMenuV2Trigger";
import { MenuItemV2 } from "./MenuItemV2";
import { MenuSectionV2 } from "./MenuSectionV2";
import { MenuSeparatorV2 } from "./MenuSeparatorV2";
import { SubmenuTriggerV2 } from "./SubmenuTriggerV2";
import { DropdownMenuV2Entry, DropdownMenuV2Props } from "./types";

const actions: DropdownMenuV2Entry[] = [
  { icon: <Edit />, label: "Rename", callback: () => {} },
  { icon: <Copy />, label: "Duplicate", callback: () => {} },
  { icon: <Download />, label: "Download", callback: () => {} },
  { icon: <Share />, label: "Share", callback: () => {} },
];

const actionsWithDanger: DropdownMenuV2Entry[] = [
  ...actions,
  { type: "separator" },
  { icon: <Trash />, label: "Delete", variant: "danger", callback: () => {} },
];

const roles: DropdownMenuV2Entry[] = [
  { label: "Reader", value: "reader", subText: "Can view" },
  { label: "Commenter", value: "commenter", subText: "Can view and comment" },
  { label: "Editor", value: "editor", subText: "Can view and edit" },
  {
    label: "Administrator",
    value: "administrator",
    subText: "Can edit and manage access",
    isDisabled: true,
  },
];

const submenus: DropdownMenuV2Entry[] = [
  { icon: <Edit />, label: "Rename", callback: () => {} },
  {
    icon: <Share />,
    label: "Share",
    children: [
      { label: "Copy link", callback: () => {} },
      { label: "Send by email", callback: () => {} },
      {
        label: "Export",
        children: [
          { label: "PDF", callback: () => {} },
          { label: "Markdown", callback: () => {} },
        ],
      },
    ],
  },
  { type: "separator" },
  { icon: <Trash />, label: "Delete", variant: "danger", callback: () => {} },
];

const meta = {
  title: "Components/DropdownMenuV2",
  component: DropdownMenuV2,
  args: {
    options: actions,
    children: <Button variant="tertiary">Actions</Button>,
  },
  argTypes: {
    options: { control: false },
    children: { control: false },
    variant: { control: "inline-radio", options: ["default", "tiny"] },
    selectionMode: { control: "inline-radio", options: ["single", "multiple"] },
    trigger: { control: "inline-radio", options: ["press", "longPress"] },
    topMessage: { control: "text" },
    bottomMessage: { control: "text" },
    onOpenChange: { action: "openChanged" },
    onSelectValue: { action: "valueSelected" },
  },
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/hPwxE24MEaX3mBQ0KXNTSY/UI-kit?node-id=11926-1524",
    },
  },
} satisfies Meta<typeof DropdownMenuV2>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Tiny: Story = {
  args: { variant: "tiny", options: actionsWithDanger },
};

export const WithDescriptions: Story = {
  args: {
    options: [
      {
        icon: <User />,
        label: "Profile",
        subText: "Name, email and avatar",
        callback: () => {},
      },
      {
        icon: <Settings />,
        label: "Settings",
        subText: "Language and notifications",
        callback: () => {},
      },
    ],
  },
};

const SelectionExample = ({
  initialValues = [],
  multiple = false,
  ...args
}: DropdownMenuV2Props & { initialValues?: string[]; multiple?: boolean }) => {
  const [selectedValues, setSelectedValues] = useState(initialValues);
  return (
    <DropdownMenuV2
      {...args}
      selectedValues={selectedValues}
      onSelectValue={(value) => {
        args.onSelectValue?.(value);
        setSelectedValues((current) =>
          !multiple
            ? [value]
            : current.includes(value)
              ? current.filter((selected) => selected !== value)
              : [...current, value],
        );
      }}
    />
  );
};

export const SingleSelection: Story = {
  args: {
    options: roles,
    children: (
      <Button variant="tertiary" icon={<ChevronDown />} iconPosition="right">
        Role
      </Button>
    ),
  },
  render: (args) => <SelectionExample {...args} initialValues={["editor"]} />,
};

export const MultipleSelection: Story = {
  args: {
    selectionMode: "multiple",
    options: [
      { label: "Documents", value: "documents" },
      { label: "Images", value: "images" },
      { label: "Videos", value: "videos" },
      { label: "Archives", value: "archives" },
    ],
    children: <Button variant="tertiary">File types</Button>,
  },
  render: (args) => (
    <SelectionExample {...args} multiple initialValues={["images"]} />
  ),
};

/** Same shape as the share modal role picker: roles, then a removal action. */
export const SelectionWithActions: Story = {
  args: {
    variant: "tiny",
    topMessage: "Only administrators can grant the Administrator role.",
    options: [
      ...roles,
      { type: "separator" },
      { label: "Remove access", variant: "danger", callback: () => {} },
    ],
    children: (
      <Button
        size="nano"
        color="neutral"
        variant="tertiary"
        icon={<ChevronDown />}
        iconPosition="right"
      >
        Role
      </Button>
    ),
  },
  render: (args) => <SelectionExample {...args} initialValues={["reader"]} />,
};

const SortExample = (args: DropdownMenuV2Props) => {
  const [sort, setSort] = useState("name");
  const option = (id: string, label: string) => ({
    label,
    isChecked: sort === id,
    keepOpen: true,
    callback: () => setSort(id),
  });
  return (
    <DropdownMenuV2
      {...args}
      options={[
        option("name", "Name"),
        option("date", "Date modified"),
        option("size", "Size"),
      ]}
    >
      <Button variant="tertiary">Sort by</Button>
    </DropdownMenuV2>
  );
};

/** Sort options with `isChecked` and no `value`: the menu stays open. */
export const CheckedItems: Story = {
  render: (args) => <SortExample {...args} />,
};

export const WithSeparatorsAndDanger: Story = {
  args: { options: actionsWithDanger },
};

export const WithSubmenus: Story = {
  args: { options: submenus },
};

export const TinyWithSubmenus: Story = {
  args: { options: submenus, variant: "tiny" },
};

/** Submenus flip to the left when there is no room on the right. */
export const SubmenuAtEdge: Story = {
  args: { options: submenus, placement: "bottom end" },
  decorators: [
    (Story) => (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Story />
      </div>
    ),
  ],
};

export const WithoutIcons: Story = {
  args: {
    options: [
      { label: "Rename", callback: () => {} },
      { label: "Duplicate", callback: () => {} },
      { label: "Download", callback: () => {} },
      { type: "separator" },
      { label: "Delete", variant: "danger", callback: () => {} },
    ],
  },
};

export const OpensInNewWindow: Story = {
  args: {
    options: [
      {
        label: "Help center",
        opensInNewWindow: true,
        callback: () => {
          window.open("https://example.com", "_blank");
        },
      },
      {
        label: "Accessibility statement",
        opensInNewWindow: true,
        callback: () => {
          window.open("https://example.com", "_blank");
        },
      },
    ],
  },
};

/** Items with `href` are real links: middle click and the context menu work. */
export const Links: Story = {
  args: {
    options: [
      {
        label: "Documentation",
        href: "https://example.com/docs",
        target: "_blank",
        rel: "noreferrer",
        opensInNewWindow: true,
      },
      { label: "Changelog", href: "https://example.com/changelog" },
    ],
  },
};

export const WithShortcuts: Story = {
  args: {
    options: [
      { icon: <Copy />, label: "Copy", shortcut: "⌘C", callback: () => {} },
      { icon: <Edit />, label: "Rename", shortcut: "F2", callback: () => {} },
      {
        icon: <Trash />,
        label: "Delete",
        shortcut: "⌫",
        variant: "danger",
        callback: () => {},
      },
    ],
  },
};

/**
 * The menu grows with its items between its minimum (150px) and maximum
 * (320px) widths; longer labels and descriptions wrap onto several lines.
 */
export const LongLabels: Story = {
  args: {
    options: [
      { icon: <Edit />, label: "Rename", callback: () => {} },
      {
        icon: <Share />,
        label: "Share with every member of the workspace and their guests",
        subText:
          "Members get the editor role, guests keep their current role on the folder",
        callback: () => {},
      },
      {
        icon: <Download />,
        label: "Download as an archive including the hidden files",
        callback: () => {},
      },
    ],
  },
};

export const TinyLongLabels: Story = {
  args: { ...LongLabels.args, variant: "tiny" },
};

export const WithTopBottomMessage: Story = {
  args: {
    topMessage: "You are viewing a shared folder.",
    bottomMessage: "Some actions need the editor role.",
    options: actionsWithDanger,
  },
};

export const HiddenItems: Story = {
  args: {
    options: [
      { label: "Open", callback: () => {} },
      { type: "separator" },
      { label: "Restore", isHidden: true },
      { type: "separator" },
      { label: "Delete", variant: "danger", callback: () => {} },
    ],
  },
};

/** A component has to forward its ref and props to a focusable element. */
const CustomTrigger = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  (props, ref) => (
    <span
      {...props}
      ref={ref}
      role="button"
      tabIndex={0}
      style={{
        padding: "6px 10px",
        border: "1px dashed currentColor",
        borderRadius: 4,
        cursor: "pointer",
      }}
    >
      Custom component
    </span>
  ),
);
CustomTrigger.displayName = "CustomTrigger";

export const Triggers: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <DropdownMenuV2 {...args}>
        <Button>Button</Button>
      </DropdownMenuV2>
      <DropdownMenuV2 {...args}>
        <Button variant="tertiary" icon={<More />} aria-label="More actions" />
      </DropdownMenuV2>
      <DropdownMenuV2 {...args}>
        <button>Native button</button>
      </DropdownMenuV2>
      <DropdownMenuV2 {...args}>
        <div
          role="button"
          tabIndex={0}
          aria-label="Account"
          style={{ borderRadius: "50%", cursor: "pointer" }}
        >
          <UserAvatar fullName="Jeanne Martin" />
        </div>
      </DropdownMenuV2>
      <DropdownMenuV2 {...args}>
        <CustomTrigger />
      </DropdownMenuV2>
      <DropdownMenuV2 {...args}>
        <Tooltip content="More actions">
          <Button
            variant="tertiary"
            color="neutral"
            icon={<More />}
            aria-label="More actions"
          />
        </Tooltip>
      </DropdownMenuV2>
      <DropdownMenuV2 {...args}>
        <AriaButton className="c__button c__button--neutral c__button--neutral--secondary c__button--medium">
          React Aria Button
        </AriaButton>
      </DropdownMenuV2>
    </div>
  ),
};

const ControlledExample = (args: DropdownMenuV2Props) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <DropdownMenuV2 {...args} isOpen={isOpen} onOpenChange={setIsOpen}>
        <Button variant="tertiary">Actions</Button>
      </DropdownMenuV2>
      <span>The menu is {isOpen ? "open" : "closed"}.</span>
    </div>
  );
};

export const Controlled: Story = {
  render: (args) => <ControlledExample {...args} />,
};

/** Opens on a long press, or Alt + ArrowDown with the keyboard. */
export const LongPress: Story = {
  args: { trigger: "longPress" },
};

export const ScrollOverflow: Story = {
  args: {
    options: Array.from({ length: 40 }, (_, index) => ({
      label: `Folder ${index + 1}`,
      callback: () => {},
    })),
  },
};

/** The composable parts, for content the `options` array cannot describe. */
export const Composition: Story = {
  render: () => (
    <DropdownMenuV2Trigger>
      <div
        role="button"
        tabIndex={0}
        aria-label="Account"
        style={{ borderRadius: "50%", cursor: "pointer", width: "fit-content" }}
      >
        <UserAvatar fullName="Jeanne Martin" />
      </div>
      <DropdownMenuV2Popover topMessage="jeanne.martin@example.com">
        <MenuSectionV2 title="Account">
          <MenuItemV2 icon={<User />} description="Name, email and avatar">
            Profile
          </MenuItemV2>
          <MenuItemV2 icon={<Settings />} shortcut="⌘,">
            Settings
          </MenuItemV2>
        </MenuSectionV2>
        <MenuSeparatorV2 />
        <SubmenuTriggerV2>
          <MenuItemV2>Language</MenuItemV2>
          <DropdownMenuV2Popover selectionMode="single" selectedKeys={["fr"]}>
            <MenuItemV2 id="fr">Français</MenuItemV2>
            <MenuItemV2 id="en">English</MenuItemV2>
          </DropdownMenuV2Popover>
        </SubmenuTriggerV2>
        <MenuSeparatorV2 />
        <MenuItemV2 icon={<Logout />} variant="danger">
          Log out
        </MenuItemV2>
      </DropdownMenuV2Popover>
    </DropdownMenuV2Trigger>
  ),
};

const ComparisonExample = ({ options, variant }: DropdownMenuV2Props) => {
  const [isV1Open, setIsV1Open] = useState(false);
  const [selectedValues, setSelectedValues] = useState(["reader"]);
  return (
    <div style={{ display: "flex", gap: 160 }}>
      <div>
        <p>V1</p>
        <DropdownMenu
          options={options}
          isOpen={isV1Open}
          onOpenChange={setIsV1Open}
          selectedValues={selectedValues}
          onSelectValue={(value) => setSelectedValues([value])}
          variant={variant}
        >
          <Button variant="tertiary" onClick={() => setIsV1Open(!isV1Open)}>
            Open V1
          </Button>
        </DropdownMenu>
      </div>
      <div>
        <p>V2</p>
        <DropdownMenuV2
          options={options}
          selectedValues={selectedValues}
          onSelectValue={(value) => setSelectedValues([value])}
          variant={variant}
        >
          <Button variant="tertiary">Open V2</Button>
        </DropdownMenuV2>
      </div>
    </div>
  );
};

/** DropdownMenu (V1) and DropdownMenuV2 with the same options. */
export const ComparisonWithV1: Story = {
  args: {
    options: [...roles, { type: "separator" }, ...actionsWithDanger],
  },
  render: (args) => <ComparisonExample {...args} />,
};
