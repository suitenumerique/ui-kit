import { forwardRef, HTMLAttributes, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button as AriaButton } from "react-aria-components";
import { Button } from ":/components/button";
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
import { DropdownMenu } from "./DropdownMenu";
import { DropdownMenuItem, DropdownMenuProps } from "./types";

const actions: DropdownMenuItem[] = [
  { icon: <Edit />, label: "Rename", callback: () => {} },
  { icon: <Copy />, label: "Duplicate", callback: () => {} },
  { icon: <Download />, label: "Download", callback: () => {} },
  { icon: <Share />, label: "Share", callback: () => {} },
];

const actionsWithDanger: DropdownMenuItem[] = [
  ...actions,
  { type: "separator" },
  { icon: <Trash />, label: "Delete", variant: "danger", callback: () => {} },
];

const roles: DropdownMenuItem[] = [
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

const submenus: DropdownMenuItem[] = [
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
  title: "Components/DropdownMenu",
  component: DropdownMenu,
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
} satisfies Meta<typeof DropdownMenu>;

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
}: DropdownMenuProps & { initialValues?: string[]; multiple?: boolean }) => {
  const [selectedValues, setSelectedValues] = useState(initialValues);
  return (
    <DropdownMenu
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

const SortExample = (args: DropdownMenuProps) => {
  const [sort, setSort] = useState("name");
  const option = (id: string, label: string) => ({
    label,
    isChecked: sort === id,
    keepOpen: true,
    callback: () => setSort(id),
  });
  return (
    <DropdownMenu
      {...args}
      options={[
        option("name", "Name"),
        option("date", "Date modified"),
        option("size", "Size"),
      ]}
    >
      <Button variant="tertiary">Sort by</Button>
    </DropdownMenu>
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
      <DropdownMenu {...args}>
        <Button>Button</Button>
      </DropdownMenu>
      <DropdownMenu {...args}>
        <Button variant="tertiary" icon={<More />} aria-label="More actions" />
      </DropdownMenu>
      <DropdownMenu {...args}>
        <button>Native button</button>
      </DropdownMenu>
      <DropdownMenu {...args}>
        <div
          role="button"
          tabIndex={0}
          aria-label="Account"
          style={{ borderRadius: "50%", cursor: "pointer" }}
        >
          <UserAvatar fullName="Jeanne Martin" />
        </div>
      </DropdownMenu>
      <DropdownMenu {...args}>
        <CustomTrigger />
      </DropdownMenu>
      <DropdownMenu {...args}>
        <Tooltip content="More actions">
          <Button
            variant="tertiary"
            color="neutral"
            icon={<More />}
            aria-label="More actions"
          />
        </Tooltip>
      </DropdownMenu>
      <DropdownMenu {...args}>
        <AriaButton className="c__button c__button--neutral c__button--neutral--secondary c__button--medium">
          React Aria Button
        </AriaButton>
      </DropdownMenu>
    </div>
  ),
};

const ControlledExample = (args: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <DropdownMenu {...args} isOpen={isOpen} onOpenChange={setIsOpen}>
        <Button variant="tertiary">Actions</Button>
      </DropdownMenu>
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
    <DropdownMenu.Trigger>
      <div
        role="button"
        tabIndex={0}
        aria-label="Account"
        style={{ borderRadius: "50%", cursor: "pointer", width: "fit-content" }}
      >
        <UserAvatar fullName="Jeanne Martin" />
      </div>
      <DropdownMenu.Popover topMessage="jeanne.martin@example.com">
        <DropdownMenu.Section title="Account">
          <DropdownMenu.Item icon={<User />} description="Name, email and avatar">
            Profile
          </DropdownMenu.Item>
          <DropdownMenu.Item icon={<Settings />} shortcut="⌘,">
            Settings
          </DropdownMenu.Item>
        </DropdownMenu.Section>
        <DropdownMenu.Separator />
        <DropdownMenu.Submenu>
          <DropdownMenu.Item>Language</DropdownMenu.Item>
          <DropdownMenu.Popover selectionMode="single" selectedKeys={["fr"]}>
            <DropdownMenu.Item id="fr">Français</DropdownMenu.Item>
            <DropdownMenu.Item id="en">English</DropdownMenu.Item>
          </DropdownMenu.Popover>
        </DropdownMenu.Submenu>
        <DropdownMenu.Separator />
        <DropdownMenu.Item icon={<Logout />} variant="danger">
          Log out
        </DropdownMenu.Item>
      </DropdownMenu.Popover>
    </DropdownMenu.Trigger>
  ),
};
