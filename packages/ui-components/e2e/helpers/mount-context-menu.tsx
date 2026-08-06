import { useState } from "react";
import { CunninghamProvider } from "../../src/components/provider/Provider";
import { ContextMenu } from "../../src/components/context-menu/ContextMenu";
import { ContextMenuProvider } from "../../src/components/context-menu/ContextMenuProvider";
import type { MenuItem } from "../../src/components/menu/types";

// Playwright CT bridges function props as one-way dispatchers, so the test file
// can't hand over the callbacks that drive the selection. This helper runs in
// the browser and owns the state itself, mirroring the `SelectedOption` story;
// tests only describe the scenario with serializable props.

const SORT_OPTIONS = [
  { label: "Name", value: "name" },
  { label: "Date modified", value: "date" },
  { label: "Size", value: "size" },
];

interface TestContextMenuProps {
  /** Initially checked option; omit for a menu without any checked item. */
  initialSort?: string;
  /** Keeps the menu open after an option is picked. */
  keepOpen?: boolean;
}

export const TestContextMenu = ({
  initialSort,
  keepOpen,
}: TestContextMenuProps) => {
  const [sortBy, setSortBy] = useState(initialSort);

  const options: MenuItem[] = [
    ...SORT_OPTIONS.map((option) => ({
      label: option.label,
      isChecked: sortBy === option.value,
      keepOpen,
      callback: () => setSortBy(option.value),
    })),
    { type: "separator" as const },
    { label: "Refresh" },
  ];

  return (
    <CunninghamProvider currentLocale="en-US">
      <ContextMenuProvider>
        <ContextMenu options={options}>
          <div style={{ padding: "40px" }}>
            <p>Right-click here to pick a sort order</p>
            <p data-testid="current-sort">{sortBy ?? "none"}</p>
          </div>
        </ContextMenu>
      </ContextMenuProvider>
    </CunninghamProvider>
  );
};

// Two triggers sharing one provider, as in a file list where every row wraps a
// ContextMenu. The `Rename` item keeps the menu open and bumps state held above
// both triggers, so picking it re-renders the folder trigger too — while the
// file trigger owns the open menu.
export const TestTwoContextMenus = () => {
  const [renames, setRenames] = useState(0);

  const fileOptions: MenuItem[] = [
    {
      label: `Rename (${renames})`,
      keepOpen: true,
      callback: () => setRenames((count) => count + 1),
    },
    { label: "Delete" },
  ];

  const folderOptions: MenuItem[] = [{ label: "Share" }, { label: "Archive" }];

  return (
    <CunninghamProvider currentLocale="en-US">
      <ContextMenuProvider>
        <ContextMenu options={fileOptions}>
          <div data-testid="file-trigger" style={{ padding: "20px" }}>
            File row
          </div>
        </ContextMenu>
        <ContextMenu options={folderOptions}>
          <div data-testid="folder-trigger" style={{ padding: "20px" }}>
            Folder row
          </div>
        </ContextMenu>
      </ContextMenuProvider>
    </CunninghamProvider>
  );
};
