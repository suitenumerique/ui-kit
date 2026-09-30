import { CunninghamProvider } from "../../src/components/provider/Provider";
import { DropdownMenu } from "../../src/components/dropdown-menu/DropdownMenu";
import { useDropdownMenu } from "../../src/components/dropdown-menu/useDropdownMenu";
import type { DropdownMenuItem } from "../../src/components/dropdown-menu/types";

// Playwright CT bridges function props as one-way dispatchers, so the test file
// can't drive the open state of a DropdownMenu. This helper runs in the browser
// and owns that state itself; tests only describe the scenario with
// serializable props.

const buildItems = (count: number, prefix: string): DropdownMenuItem[] =>
  Array.from({ length: count }, (_, index) => ({
    label: `${prefix} ${index + 1}`,
  }));

interface TestDropdownMenuProps {
  /** Number of items in the root menu. */
  itemCount: number;
  /** Number of items in a submenu appended to the root menu; omit for none. */
  submenuItemCount?: number;
  topMessage?: string;
  bottomMessage?: string;
}

export const TestDropdownMenu = ({
  itemCount,
  submenuItemCount,
  topMessage,
  bottomMessage,
}: TestDropdownMenuProps) => {
  const { isOpen, setIsOpen } = useDropdownMenu();

  const options: DropdownMenuItem[] = [
    ...buildItems(itemCount, "Item"),
    ...(submenuItemCount
      ? [
          {
            label: "More",
            children: buildItems(submenuItemCount, "Subitem"),
          },
        ]
      : []),
  ];

  return (
    <CunninghamProvider currentLocale="en-US">
      <DropdownMenu
        options={options}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        topMessage={topMessage}
        bottomMessage={bottomMessage}
      >
        <button type="button" onClick={() => setIsOpen(!isOpen)}>
          Open menu
        </button>
      </DropdownMenu>
    </CunninghamProvider>
  );
};
