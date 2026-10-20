import { MenuItemSeparator } from "../menu/types";
import { DropdownMenuV2Entry, DropdownMenuV2Option } from "./types";

export type MenuModelItem = {
  kind: "item";
  key: string;
  option: DropdownMenuV2Option;
  isSelectable: boolean;
  isSelected: boolean;
  submenu?: MenuModelLevel;
};

export type MenuModelSeparator = { kind: "separator"; key: string };

/** Consecutive selectable items sharing one selection group. */
export type MenuModelGroup = {
  kind: "group";
  key: string;
  items: MenuModelItem[];
  selectedKeys: string[];
};

export type MenuModelNode = MenuModelItem | MenuModelSeparator | MenuModelGroup;

export type MenuModelLevel = {
  /**
   * Where the selection lives: on the whole menu when every item is
   * selectable, on groups when selectable and action items are mixed.
   */
  selection: "menu" | "groups" | "none";
  selectedKeys: string[];
  nodes: MenuModelNode[];
};

export const isSeparatorEntry = (
  entry: DropdownMenuV2Entry,
): entry is MenuItemSeparator => "type" in entry && entry.type === "separator";

const SEPARATOR = "separator" as const;

/** Drops hidden items, then leading, trailing and doubled separators. */
const visibleEntries = (entries: DropdownMenuV2Entry[]) => {
  const result: (DropdownMenuV2Option | typeof SEPARATOR)[] = [];
  const pushSeparator = () => {
    if (result.length > 0 && result[result.length - 1] !== SEPARATOR) {
      result.push(SEPARATOR);
    }
  };

  for (const entry of entries) {
    if (isSeparatorEntry(entry)) {
      pushSeparator();
      continue;
    }
    if (entry.isHidden) {
      continue;
    }
    result.push(entry);
    if (entry.showSeparator) {
      pushSeparator();
    }
  }

  if (result[result.length - 1] === SEPARATOR) {
    result.pop();
  }
  return result;
};

/**
 * Turns the `options` of a DropdownMenuV2 into the tree it renders: visible
 * items with unique keys, their selection state, and the selection scope of
 * each menu level.
 */
export const buildMenuModel = (
  entries: DropdownMenuV2Entry[],
  selectedValues: string[] = [],
): MenuModelLevel => {
  const usedKeys = new Set<string>();
  const uniqueKey = (base: string) => {
    let key = base;
    for (let index = 1; usedKeys.has(key); index++) {
      key = `${base}-${index}`;
    }
    usedKeys.add(key);
    return key;
  };

  const flatNodes: (MenuModelItem | MenuModelSeparator)[] = visibleEntries(
    entries,
  ).map((entry) => {
    if (entry === SEPARATOR) {
      return { kind: "separator", key: uniqueKey("__separator") };
    }

    const key = uniqueKey(entry.id ?? entry.value ?? entry.label);
    const submenu = entry.children?.length
      ? buildMenuModel(entry.children, selectedValues)
      : undefined;
    if (submenu && submenu.nodes.length > 0) {
      return {
        kind: "item",
        key,
        option: entry,
        isSelectable: false,
        isSelected: false,
        submenu,
      };
    }

    return {
      kind: "item",
      key,
      option: entry,
      isSelectable: !!entry.value || entry.isChecked !== undefined,
      isSelected:
        !!entry.isChecked ||
        (!!entry.value && selectedValues.includes(entry.value)),
    };
  });

  const items = flatNodes.filter(
    (node): node is MenuModelItem => node.kind === "item",
  );
  const selectedKeysOf = (nodes: MenuModelItem[]) =>
    nodes.filter((item) => item.isSelected).map((item) => item.key);

  if (items.length > 0 && items.every((item) => item.isSelectable)) {
    return {
      selection: "menu",
      selectedKeys: selectedKeysOf(items),
      nodes: flatNodes,
    };
  }

  const nodes: MenuModelNode[] = [];
  let group: MenuModelItem[] = [];
  const flushGroup = () => {
    if (group.length > 0) {
      nodes.push({
        kind: "group",
        key: `__group-${group[0].key}`,
        items: group,
        selectedKeys: selectedKeysOf(group),
      });
      group = [];
    }
  };

  for (const node of flatNodes) {
    if (node.kind === "item" && node.isSelectable) {
      group.push(node);
      continue;
    }
    flushGroup();
    nodes.push(node);
  }
  flushGroup();

  return {
    selection: nodes.some((node) => node.kind === "group") ? "groups" : "none",
    selectedKeys: [],
    nodes,
  };
};
