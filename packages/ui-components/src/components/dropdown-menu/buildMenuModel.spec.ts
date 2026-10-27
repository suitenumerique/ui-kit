import {
  buildMenuModel,
  MenuModelGroup,
  MenuModelItem,
  MenuModelNode,
} from "./buildMenuModel";
import { DropdownMenuItem } from "./types";

const kinds = (nodes: MenuModelNode[]) => nodes.map((node) => node.kind);
const keys = (nodes: MenuModelNode[]) => nodes.map((node) => node.key);
const itemKeys = (nodes: MenuModelNode[]) =>
  nodes.flatMap((node) =>
    node.kind === "group" ? keys(node.items) : [node.key],
  );

describe("buildMenuModel", () => {
  it("drops hidden items and the separators they leave orphaned", () => {
    const entries: DropdownMenuItem[] = [
      { type: "separator" },
      { label: "Open" },
      { type: "separator" },
      { label: "Hidden", isHidden: true },
      { type: "separator" },
      { label: "Rename" },
      { type: "separator" },
    ];

    const { nodes } = buildMenuModel(entries);

    expect(kinds(nodes)).toEqual(["item", "separator", "item"]);
  });

  it("turns the deprecated showSeparator flag into a separator", () => {
    const { nodes } = buildMenuModel([
      { label: "Open", showSeparator: true },
      { label: "Delete" },
    ]);

    expect(kinds(nodes)).toEqual(["item", "separator", "item"]);
  });

  it("gives every item a unique key", () => {
    const { nodes } = buildMenuModel([
      { label: "Copy" },
      { label: "Copy" },
      { id: "copy-link", label: "Copy" },
      { value: "fr", label: "Français" },
    ]);

    expect(itemKeys(nodes)).toEqual(["Copy", "Copy-1", "copy-link", "fr"]);
  });

  it("puts the selection on the menu when every item is selectable", () => {
    const level = buildMenuModel(
      [
        { value: "fr", label: "Français" },
        { value: "en", label: "English" },
      ],
      ["en"],
    );

    expect(level.selection).toBe("menu");
    expect(level.selectedKeys).toEqual(["en"]);
    expect(kinds(level.nodes)).toEqual(["item", "item"]);
  });

  it("gives each run of selectable items split by separators its own group", () => {
    const level = buildMenuModel(
      [
        { value: "name", label: "Name" },
        { value: "date", label: "Date" },
        { type: "separator" },
        { value: "asc", label: "Ascending" },
        { value: "desc", label: "Descending" },
      ],
      ["name", "asc"],
    );

    expect(level.selection).toBe("groups");
    expect(kinds(level.nodes)).toEqual(["group", "separator", "group"]);
    const [sortBy, , order] = level.nodes as MenuModelGroup[];
    expect(sortBy.selectedKeys).toEqual(["name"]);
    expect(order.selectedKeys).toEqual(["asc"]);
  });

  it("groups selectable items apart from action items", () => {
    const level = buildMenuModel(
      [
        { value: "reader", label: "Reader" },
        { value: "editor", label: "Editor" },
        { type: "separator" },
        { label: "Remove access", variant: "danger" },
      ],
      ["editor"],
    );

    expect(level.selection).toBe("groups");
    expect(kinds(level.nodes)).toEqual(["group", "separator", "item"]);
    const group = level.nodes[0] as MenuModelGroup;
    expect(keys(group.items)).toEqual(["reader", "editor"]);
    expect(group.selectedKeys).toEqual(["editor"]);
  });

  it("treats an empty string value as a value", () => {
    const level = buildMenuModel(
      [
        { label: "All", value: "" },
        { label: "Mine", value: "mine" },
      ],
      [""],
    );

    expect(level.selection).toBe("menu");
    expect(level.selectedKeys).toEqual(["All"]);
  });

  it("treats isChecked items as selectable, checked or not", () => {
    const level = buildMenuModel([
      { label: "Name", isChecked: false },
      { label: "Date", isChecked: true },
    ]);

    expect(level.selection).toBe("menu");
    expect(level.selectedKeys).toEqual(["Date"]);
  });

  it("keeps a menu without selectable item free of selection", () => {
    const level = buildMenuModel([{ label: "Open" }, { label: "Share" }]);

    expect(level.selection).toBe("none");
    expect(kinds(level.nodes)).toEqual(["item", "item"]);
  });

  it("builds submenus and renders an emptied submenu as a plain item", () => {
    const level = buildMenuModel(
      [
        {
          label: "Language",
          children: [
            { value: "fr", label: "Français" },
            { value: "en", label: "English" },
          ],
        },
        { label: "Legal", children: [{ label: "Terms", isHidden: true }] },
      ],
      ["fr"],
    );

    const [language, legal] = level.nodes as MenuModelItem[];
    expect(language.isSelectable).toBe(false);
    expect(language.submenu?.selection).toBe("menu");
    expect(language.submenu?.selectedKeys).toEqual(["fr"]);
    expect(legal.submenu).toBeUndefined();
  });
});
