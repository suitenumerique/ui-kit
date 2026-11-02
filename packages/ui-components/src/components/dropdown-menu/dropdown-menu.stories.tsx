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
import { DropdownMenuTrigger } from "./DropdownMenuTrigger";
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

/**
 * Shortens the generated "Show code" snippets: each inline `options` array is
 * declared once as a variable, and the no-op handlers Storybook adds for the
 * actions are dropped.
 */
const extractOptions = (code: string) => {
  const declarations: string[] = [];
  const names = new Map<string, string>();
  let result = "";
  let index = 0;
  const marker = "options={[";
  while (true) {
    const start = code.indexOf(marker, index);
    if (start === -1) break;
    let depth = 0;
    let end = start + marker.length - 1;
    for (; end < code.length; end++) {
      if (code[end] === "[") depth++;
      else if (code[end] === "]" && --depth === 0) break;
    }
    const array = code.slice(start + marker.length - 1, end + 1);
    let name = names.get(array);
    if (!name) {
      name = names.size === 0 ? "options" : `options${names.size + 1}`;
      names.set(array, name);
      // Re-indent the array from its position in the JSX to the top level.
      const lineStart = code.lastIndexOf("\n", start) + 1;
      const indent = code.slice(lineStart, start).match(/^\s*/)![0];
      declarations.push(
        `const ${name} = ${compactItems(array.replaceAll(`\n${indent}`, "\n"))};`,
      );
    }
    result += code.slice(index, start) + `options={${name}}`;
    index = end + 2;
  }
  result += code.slice(index);
  return declarations.length
    ? `${declarations.join("\n\n")}\n\n${result}`
    : result;
};

/** Puts each object without nested objects or arrays on a single line. */
const compactItems = (code: string) =>
  code
    .replaceAll("() => {}", "\u0000")
    .replace(/\{\n([^{}[\]]*?)\n\s*\}/g, (_, body: string) =>
      `{ ${body.split("\n").map((line) => line.trim()).join(" ")} }`,
    )
    .replaceAll("\u0000", "() => {}");

const shortenSource = (code: string) =>
  extractOptions(code).replace(
    /\n\s*(onOpenChange|onSelectValue)=\{\(\) => \{\}\}/g,
    "",
  );

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
    docs: { source: { transform: shortenSource } },
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

// The shown code declares the options once instead of repeating them in every
// menu, as the generated snippet would.
const triggersSource = `const options = [
  { label: "Rename", icon: <Edit />, callback: rename },
  { label: "Duplicate", icon: <Copy />, callback: duplicate },
  { label: "Download", icon: <Download />, callback: download },
  { label: "Share", icon: <Share />, callback: share },
];

// A component forwarding its ref and props to a focusable element.
const CustomTrigger = (props: ComponentProps<"span">) => (
  <span {...props} role="button" tabIndex={0}>
    Custom component
  </span>
);

<DropdownMenu options={options}>
  <Button>Button</Button>
</DropdownMenu>

<DropdownMenu options={options}>
  <Button variant="tertiary" icon={<More />} aria-label="More actions" />
</DropdownMenu>

<DropdownMenu options={options}>
  <button>Native button</button>
</DropdownMenu>

<DropdownMenu options={options}>
  <DropdownMenuTrigger aria-label="Account" style={{ borderRadius: "50%" }}>
    <UserAvatar fullName="Jeanne Martin" />
  </DropdownMenuTrigger>
</DropdownMenu>

<DropdownMenu options={options}>
  <CustomTrigger />
</DropdownMenu>

<DropdownMenu options={options}>
  <Tooltip content="More actions">
    <Button variant="tertiary" color="neutral" icon={<More />} aria-label="More actions" />
  </Tooltip>
</DropdownMenu>

<DropdownMenu options={options}>
  <AriaButton className="c__button c__button--neutral c__button--neutral--secondary c__button--medium">
    React Aria Button
  </AriaButton>
</DropdownMenu>`;

export const Triggers: Story = {
  parameters: { docs: { source: { code: triggersSource } } },
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
        <DropdownMenuTrigger aria-label="Account" style={{ borderRadius: "50%" }}>
          <UserAvatar fullName="Jeanne Martin" />
        </DropdownMenuTrigger>
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

// Viewports short enough for the menu popover to lack room. Switch between
// them, or resize the browser, from the toolbar viewport menu.
const shortViewports = {
  constrained: {
    name: "Constrained height (400px)",
    styles: { width: "1024px", height: "400px" },
    type: "desktop",
  },
  veryConstrained: {
    name: "Very constrained height (200px)",
    styles: { width: "1024px", height: "200px" },
    type: "desktop",
  },
};

/**
 * When the popover lacks room, the menu is capped to the available height:
 * the top and bottom messages keep their place while the list scrolls.
 * Use the toolbar viewport menu to try other heights.
 */
export const ConstrainedHeight: Story = {
  args: {
    options: Array.from({ length: 30 }, (_, index) => ({
      label: `Folder ${index + 1}`,
      value: `folder-${index + 1}`,
    })),
    topMessage: "Pick the destination folder",
    bottomMessage: "30 folders available",
    children: <Button variant="tertiary">Move to</Button>,
  },
  parameters: {
    layout: "fullscreen",
    viewport: { viewports: shortViewports, defaultViewport: "constrained" },
  },
  // The trigger sits mid-height so the popover has no better side to flip to.
  render: (args) => (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SelectionExample {...args} />
    </div>
  ),
};

/**
 * When even the top and bottom messages and one item lack room, the whole
 * menu scrolls as one instead, so nothing gets out of reach without nesting
 * the list scroll in the menu scroll.
 */
export const VeryConstrainedHeight: Story = {
  ...ConstrainedHeight,
  parameters: {
    layout: "fullscreen",
    viewport: { viewports: shortViewports, defaultViewport: "veryConstrained" },
  },
};

/**
 * `DropdownMenuTrigger` wraps any content in a button with no look of its
 * own, styled here from its state. The `aria-label` keeps the avatar initials
 * out of its name.
 */
export const UnstyledTrigger: Story = {
  parameters: {
    docs: {
      source: {
        code: `const options = [
  { label: "Profile", icon: <User />, callback: openProfile },
  { label: "Settings", icon: <Settings />, callback: openSettings },
  { type: "separator" },
  { label: "Log out", icon: <Logout />, variant: "danger", callback: logout },
];

<DropdownMenu options={options}>
  <DropdownMenuTrigger
    aria-label="Jeanne Martin's account"
    style={({ isHovered, isPressed }) => ({
      gap: 8,
      padding: "4px 8px 4px 4px",
      borderRadius: 999,
      backgroundColor:
        isHovered || isPressed
          ? "var(--c--contextuals--background--semantic--overlay--primary)"
          : undefined,
    })}
  >
    <UserAvatar fullName="Jeanne Martin" />
    <span>Jeanne Martin</span>
    <ChevronDown />
  </DropdownMenuTrigger>
</DropdownMenu>`,
      },
    },
  },
  args: {
    options: [
      { icon: <User />, label: "Profile", callback: () => {} },
      { icon: <Settings />, label: "Settings", callback: () => {} },
      { type: "separator" },
      { icon: <Logout />, label: "Log out", variant: "danger", callback: () => {} },
    ],
  },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger
        aria-label="Jeanne Martin's account"
        style={({ isHovered, isPressed }) => ({
          gap: 8,
          padding: "4px 8px 4px 4px",
          borderRadius: 999,
          backgroundColor:
            isHovered || isPressed
              ? "var(--c--contextuals--background--semantic--overlay--primary)"
              : undefined,
        })}
      >
        <UserAvatar fullName="Jeanne Martin" />
        <span>Jeanne Martin</span>
        <ChevronDown />
      </DropdownMenuTrigger>
    </DropdownMenu>
  ),
};

/** The composable parts, for content the `options` array cannot describe. */
export const Composition: Story = {
  render: () => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger aria-label="Account" style={{ borderRadius: "50%" }}>
        <UserAvatar fullName="Jeanne Martin" />
      </DropdownMenu.Trigger>
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
    </DropdownMenu.Root>
  ),
};
