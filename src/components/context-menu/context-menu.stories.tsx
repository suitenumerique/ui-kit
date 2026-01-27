import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ContextMenu } from "./ContextMenu";
import { ContextMenuProvider } from "./ContextMenuProvider";
import { MenuItem } from "./types";

/**
 * The `ContextMenu` component displays a context menu on right-click.
 *
 * ## Installation
 *
 * The component requires a `ContextMenuProvider` parent to work:
 *
 * ```tsx
 * import { ContextMenuProvider, ContextMenu } from "@gouvfr-lasuite/ui-kit";
 *
 * function App() {
 *   return (
 *     <ContextMenuProvider>
 *       <MyComponent />
 *     </ContextMenuProvider>
 *   );
 * }
 * ```
 *
 * ## Basic usage
 *
 * ```tsx
 * const items: MenuItem[] = [
 *   {
 *     label: "Open",
 *     icon: <span className="material-icons">open_in_new</span>,
 *     callback: () => console.log("Open"),
 *   },
 *   { type: "separator" },
 *   {
 *     label: "Delete",
 *     variant: "danger",
 *     callback: () => console.log("Delete"),
 *   },
 * ];
 *
 * <ContextMenu options={items}>
 *   <div>Right-click here</div>
 * </ContextMenu>
 * ```
 *
 * ## Dynamic menu with context
 *
 * For menus that depend on the clicked element, use a function:
 *
 * ```tsx
 * <ContextMenu
 *   options={(file) => [
 *     { label: `Open ${file.name}`, callback: () => open(file.id) },
 *     { label: "Delete", callback: () => remove(file.id), variant: "danger" },
 *   ]}
 *   context={file}
 * >
 *   <FileCard file={file} />
 * </ContextMenu>
 * ```
 *
 * ## MenuItem props
 *
 * | Prop | Type | Description |
 * |------|------|-------------|
 * | `label` | `string` | Text displayed in the menu |
 * | `subText` | `string` | Secondary text below the label |
 * | `icon` | `ReactNode` | Icon displayed on the left |
 * | `callback` | `() => void` | Callback on click |
 * | `isDisabled` | `boolean` | Disables the item |
 * | `isHidden` | `boolean` | Hides the item |
 * | `variant` | `"default" \| "danger"` | Item style |
 *
 * For a separator: `{ type: "separator" }`
 *
 * ## Shared type with DropdownMenu
 *
 * The `MenuItem` type is shared with `DropdownMenu`, allowing you to define actions once
 * and use them in both components (e.g., "..." button and right-click menu).
 *
 * ## asChild pattern
 *
 * To avoid a wrapper element, use `asChild`:
 *
 * ```tsx
 * <ContextMenu options={items} asChild>
 *   <li>List item</li>
 * </ContextMenu>
 * ```
 *
 * ## Focus tracking with onFocus/onBlur
 *
 * Use `onFocus` and `onBlur` callbacks to track when the menu is open on a specific trigger.
 * This is useful for highlighting the right-clicked element while the menu is visible.
 *
 * ```tsx
 * function FileCard({ file }) {
 *   const [isFocused, setIsFocused] = useState(false);
 *
 *   return (
 *     <ContextMenu
 *       options={fileActions}
 *       onFocus={() => setIsFocused(true)}
 *       onBlur={() => setIsFocused(false)}
 *     >
 *       <div className={isFocused ? "file-card--focused" : "file-card"}>
 *         {file.name}
 *       </div>
 *     </ContextMenu>
 *   );
 * }
 * ```
 *
 * - `onFocus`: Called immediately when the menu opens on this trigger
 * - `onBlur`: Called when the menu closes (click outside, action selected, or right-click elsewhere)
 */
const meta = {
  title: "Components/ContextMenu",
  component: ContextMenu,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ContextMenuProvider>
        <Story />
      </ContextMenuProvider>
    ),
  ],
  argTypes: {
    options: {
      description: "Menu items array, or function returning items",
      control: false,
    },
    context: {
      description: "Data passed to the options function (if options is a function)",
      control: false,
    },
    disabled: {
      description: "Disables the context menu",
      control: "boolean",
    },
    asChild: {
      description: "Clones the child instead of wrapping in a div",
      control: "boolean",
    },
    children: {
      description: "Element(s) on which right-click triggers the menu",
      control: false,
    },
    onFocus: {
      description: "Called when the menu opens on this trigger",
      control: false,
    },
    onBlur: {
      description: "Called when the menu closes (if it was open on this trigger)",
      control: false,
    },
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicItems: MenuItem[] = [
  {
    label: "Open",
    subText: "Open in a new tab",
    icon: <span className="material-icons">open_in_new</span>,
    callback: () => alert("Open"),
  },
  {
    label: "Download",
    icon: <span className="material-icons">download</span>,
    callback: () => alert("Download"),
  },
  { type: "separator" },
  {
    label: "Rename",
    icon: <span className="material-icons">edit</span>,
    callback: () => alert("Rename"),
  },
];

/**
 * Basic example with a static menu.
 * Items can have a label, icon, subText, and action.
 */
export const Basic: Story = {
  args: {
    options: basicItems,
    children: null,
  },
  render: (args) => (
    <ContextMenu options={args.options}>
      <div
        style={{
          padding: "40px",
          border: "2px dashed #ccc",
          borderRadius: "8px",
          textAlign: "center",
          backgroundColor: "#f9f9f9",
        }}
      >
        Right-click here to open the menu
      </div>
    </ContextMenu>
  ),
};

type FileItem = {
  id: number;
  name: string;
  type: "file" | "folder";
};

const files: FileItem[] = [
  { id: 1, name: "Documents", type: "folder" },
  { id: 2, name: "report.pdf", type: "file" },
  { id: 3, name: "photo.jpg", type: "file" },
];

const getFileMenuItems = (file: FileItem): MenuItem[] => [
  {
    label: "Open",
    subText: file.type === "folder" ? "View contents" : "Open file",
    icon: <span className="material-icons">open_in_new</span>,
    callback: () => alert(`Open: ${file.name}`),
  },
  {
    label: "Download",
    subText: "Download to your device",
    icon: <span className="material-icons">download</span>,
    callback: () => alert(`Download: ${file.name} (id: ${file.id})`),
    isHidden: file.type === "folder",
  },
  { type: "separator" },
  {
    label: "Rename",
    icon: <span className="material-icons">edit</span>,
    callback: () => alert(`Rename: ${file.name}`),
  },
  {
    label: "Delete",
    subText: "Move to trash",
    icon: <span className="material-icons">delete</span>,
    callback: () => alert(`Delete: ${file.name}`),
    variant: "danger",
  },
];

/**
 * Dynamic menu based on context.
 * The `options` prop is a function that receives the `context` and returns items.
 * Useful for adapting the menu based on the clicked element (e.g., file vs folder).
 */
export const DynamicWithContext: Story = {
  args: {
    options: [],
    children: null,
  },
  render: () => (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      {files.map((file) => (
        <ContextMenu key={file.id} options={getFileMenuItems} context={file}>
          <div
            style={{
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              textAlign: "center",
              minWidth: "120px",
              backgroundColor: "#fff",
              cursor: "default",
            }}
          >
            <span
              className="material-icons"
              style={{ fontSize: "48px", color: "#666" }}
            >
              {file.type === "folder" ? "folder" : "description"}
            </span>
            <div style={{ marginTop: "8px" }}>{file.name}</div>
          </div>
        </ContextMenu>
      ))}
    </div>
  ),
};

const backgroundItems: MenuItem[] = [
  {
    label: "New file",
    icon: <span className="material-icons">note_add</span>,
    callback: () => alert("New file"),
  },
  {
    label: "New folder",
    icon: <span className="material-icons">create_new_folder</span>,
    callback: () => alert("New folder"),
  },
  { type: "separator" },
  {
    label: "Paste",
    icon: <span className="material-icons">content_paste</span>,
    callback: () => alert("Paste"),
    isDisabled: true,
  },
];

/**
 * Nested context menus.
 * The menu closest to the clicked element is displayed.
 * Here, the background area has a "New" menu, and each file has its own menu.
 */
export const NestedContextMenus: Story = {
  args: {
    options: [],
    children: null,
  },
  render: () => (
    <ContextMenu options={backgroundItems}>
      <div
        style={{
          padding: "40px",
          border: "2px solid #e0e0e0",
          borderRadius: "8px",
          backgroundColor: "#fafafa",
          minHeight: "300px",
        }}
      >
        <p style={{ marginBottom: "20px", color: "#666" }}>
          Background area (right-click = &quot;New file/folder&quot; menu)
        </p>
        <div style={{ display: "flex", gap: "16px" }}>
          {files.slice(0, 2).map((file) => (
            <ContextMenu key={file.id} options={getFileMenuItems} context={file}>
              <div
                style={{
                  padding: "20px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  textAlign: "center",
                  minWidth: "120px",
                  backgroundColor: "#fff",
                  cursor: "default",
                }}
              >
                <span
                  className="material-icons"
                  style={{ fontSize: "48px", color: "#666" }}
                >
                  {file.type === "folder" ? "folder" : "description"}
                </span>
                <div style={{ marginTop: "8px" }}>{file.name}</div>
                <div style={{ fontSize: "12px", color: "#999" }}>
                  (right-click = {file.type})
                </div>
              </div>
            </ContextMenu>
          ))}
        </div>
      </div>
    </ContextMenu>
  ),
};

const variantItems: MenuItem[] = [
  {
    label: "Normal action",
    icon: <span className="material-icons">check</span>,
    callback: () => alert("Normal action"),
  },
  {
    label: "Disabled action",
    icon: <span className="material-icons">block</span>,
    callback: () => alert("Should not appear"),
    isDisabled: true,
  },
  { type: "separator" },
  {
    label: "Delete permanently",
    icon: <span className="material-icons">delete_forever</span>,
    callback: () => alert("Deleted"),
    variant: "danger",
  },
];

/**
 * Item variants: disabled and danger.
 * - `isDisabled: true`: the item is grayed out and not clickable
 * - `variant: "danger"`: the item is displayed in red for destructive actions
 */
export const DisabledAndDangerVariants: Story = {
  args: {
    options: variantItems,
    children: null,
  },
  render: (args) => (
    <ContextMenu options={args.options}>
      <div
        style={{
          padding: "40px",
          border: "2px dashed #ccc",
          borderRadius: "8px",
          textAlign: "center",
          backgroundColor: "#f9f9f9",
        }}
      >
        Right-click to see variants (disabled, danger)
      </div>
    </ContextMenu>
  ),
};

/**
 * asChild pattern to avoid wrappers.
 * With `asChild={true}`, ContextMenu clones its single child
 * and adds the `onContextMenu` handler without adding a div.
 * Useful for preserving layout (e.g., list elements `<li>`).
 */
export const WithAsChild: Story = {
  args: {
    options: basicItems,
    asChild: true,
    children: null,
  },
  render: (args) => (
    <ul style={{ listStyle: "none", padding: 0 }}>
      <ContextMenu options={args.options} asChild>
        <li
          style={{
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginBottom: "8px",
            backgroundColor: "#fff",
          }}
        >
          List item with asChild (no div wrapper)
        </li>
      </ContextMenu>
      <ContextMenu options={args.options} asChild>
        <li
          style={{
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#fff",
          }}
        >
          Another list item
        </li>
      </ContextMenu>
    </ul>
  ),
};

const FileCardWithFocus = ({
  file,
}: {
  file: FileItem;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <ContextMenu
      options={getFileMenuItems}
      context={file}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <div
        style={{
          padding: "20px",
          border: isFocused ? "2px solid #0063cb" : "1px solid #ddd",
          borderRadius: "8px",
          textAlign: "center",
          minWidth: "120px",
          backgroundColor: isFocused ? "#e8f4fd" : "#fff",
          cursor: "default",
          transition: "all 0.15s ease",
        }}
      >
        <span
          className="material-icons"
          style={{ fontSize: "48px", color: isFocused ? "#0063cb" : "#666" }}
        >
          {file.type === "folder" ? "folder" : "description"}
        </span>
        <div style={{ marginTop: "8px" }}>{file.name}</div>
      </div>
    </ContextMenu>
  );
};

/**
 * Focus highlighting with onFocus/onBlur callbacks.
 *
 * Use `onFocus` and `onBlur` to track when the menu is open on a specific trigger.
 * This enables highlighting the right-clicked element while the menu is visible.
 *
 * - `onFocus`: Called immediately when the menu opens on this trigger
 * - `onBlur`: Called when the menu closes (click outside, action selected, or right-click elsewhere)
 *
 * Try right-clicking on the items below:
 * - The clicked item highlights with a blue border
 * - Clicking outside or selecting an action removes the highlight
 * - Right-clicking another item moves the highlight
 */
export const FocusHighlighting: Story = {
  args: {
    options: [],
    children: null,
  },
  render: () => (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      {files.map((file) => (
        <FileCardWithFocus key={file.id} file={file} />
      ))}
    </div>
  ),
};
