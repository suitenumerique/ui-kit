import type { Meta, StoryObj } from "@storybook/react";
import { ContextMenu } from "./ContextMenu";
import { ContextMenuProvider } from "./ContextMenuProvider";
import { ContextMenuItem } from "./types";

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
 * const items: ContextMenuItem[] = [
 *   {
 *     label: "Open",
 *     icon: <span className="material-icons">open_in_new</span>,
 *     onAction: () => console.log("Open"),
 *   },
 *   { type: "separator" },
 *   {
 *     label: "Delete",
 *     variant: "danger",
 *     onAction: () => console.log("Delete"),
 *   },
 * ];
 *
 * <ContextMenu menu={items}>
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
 *   menu={(file) => [
 *     { label: `Open ${file.name}`, onAction: () => open(file.id) },
 *     { label: "Delete", onAction: () => remove(file.id), variant: "danger" },
 *   ]}
 *   context={file}
 * >
 *   <FileCard file={file} />
 * </ContextMenu>
 * ```
 *
 * ## ContextMenuItem props
 *
 * | Prop | Type | Description |
 * |------|------|-------------|
 * | `label` | `string` | Text displayed in the menu |
 * | `subText` | `string` | Secondary text below the label |
 * | `icon` | `ReactNode` | Icon displayed on the left |
 * | `onAction` | `() => void` | Callback on click |
 * | `disabled` | `boolean` | Disables the item |
 * | `hidden` | `boolean` | Hides the item |
 * | `variant` | `"default" \| "danger"` | Item style |
 *
 * For a separator: `{ type: "separator" }`
 *
 * ## asChild pattern
 *
 * To avoid a wrapper element, use `asChild`:
 *
 * ```tsx
 * <ContextMenu menu={items} asChild>
 *   <li>List item</li>
 * </ContextMenu>
 * ```
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
    menu: {
      description: "Menu items array, or function returning items",
      control: false,
    },
    context: {
      description: "Data passed to the menu function (if menu is a function)",
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
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicItems: ContextMenuItem[] = [
  {
    label: "Open",
    subText: "Open in a new tab",
    icon: <span className="material-icons">open_in_new</span>,
    onAction: () => alert("Open"),
  },
  {
    label: "Download",
    icon: <span className="material-icons">download</span>,
    onAction: () => alert("Download"),
  },
  { type: "separator" },
  {
    label: "Rename",
    icon: <span className="material-icons">edit</span>,
    onAction: () => alert("Rename"),
  },
];

/**
 * Basic example with a static menu.
 * Items can have a label, icon, subText, and action.
 */
export const Basic: Story = {
  args: {
    menu: basicItems,
    children: null,
  },
  render: (args) => (
    <ContextMenu menu={args.menu}>
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

const getFileMenuItems = (file: FileItem): ContextMenuItem[] => [
  {
    label: "Open",
    subText: file.type === "folder" ? "View contents" : "Open file",
    icon: <span className="material-icons">open_in_new</span>,
    onAction: () => alert(`Open: ${file.name}`),
  },
  {
    label: "Download",
    subText: "Download to your device",
    icon: <span className="material-icons">download</span>,
    onAction: () => alert(`Download: ${file.name} (id: ${file.id})`),
    hidden: file.type === "folder",
  },
  { type: "separator" },
  {
    label: "Rename",
    icon: <span className="material-icons">edit</span>,
    onAction: () => alert(`Rename: ${file.name}`),
  },
  {
    label: "Delete",
    subText: "Move to trash",
    icon: <span className="material-icons">delete</span>,
    onAction: () => alert(`Delete: ${file.name}`),
    variant: "danger",
  },
];

/**
 * Dynamic menu based on context.
 * The `menu` prop is a function that receives the `context` and returns items.
 * Useful for adapting the menu based on the clicked element (e.g., file vs folder).
 */
export const DynamicWithContext: Story = {
  args: {
    menu: [],
    children: null,
  },
  render: () => (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      {files.map((file) => (
        <ContextMenu key={file.id} menu={getFileMenuItems} context={file}>
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

const backgroundItems: ContextMenuItem[] = [
  {
    label: "New file",
    icon: <span className="material-icons">note_add</span>,
    onAction: () => alert("New file"),
  },
  {
    label: "New folder",
    icon: <span className="material-icons">create_new_folder</span>,
    onAction: () => alert("New folder"),
  },
  { type: "separator" },
  {
    label: "Paste",
    icon: <span className="material-icons">content_paste</span>,
    onAction: () => alert("Paste"),
    disabled: true,
  },
];

/**
 * Nested context menus.
 * The menu closest to the clicked element is displayed.
 * Here, the background area has a "New" menu, and each file has its own menu.
 */
export const NestedContextMenus: Story = {
  args: {
    menu: [],
    children: null,
  },
  render: () => (
    <ContextMenu menu={backgroundItems}>
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
            <ContextMenu key={file.id} menu={getFileMenuItems} context={file}>
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

const variantItems: ContextMenuItem[] = [
  {
    label: "Normal action",
    icon: <span className="material-icons">check</span>,
    onAction: () => alert("Normal action"),
  },
  {
    label: "Disabled action",
    icon: <span className="material-icons">block</span>,
    onAction: () => alert("Should not appear"),
    disabled: true,
  },
  { type: "separator" },
  {
    label: "Delete permanently",
    icon: <span className="material-icons">delete_forever</span>,
    onAction: () => alert("Deleted"),
    variant: "danger",
  },
];

/**
 * Item variants: disabled and danger.
 * - `disabled: true`: the item is grayed out and not clickable
 * - `variant: "danger"`: the item is displayed in red for destructive actions
 */
export const DisabledAndDangerVariants: Story = {
  args: {
    menu: variantItems,
    children: null,
  },
  render: (args) => (
    <ContextMenu menu={args.menu}>
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
    menu: basicItems,
    asChild: true,
    children: null,
  },
  render: (args) => (
    <ul style={{ listStyle: "none", padding: 0 }}>
      <ContextMenu menu={args.menu} asChild>
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
      <ContextMenu menu={args.menu} asChild>
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
