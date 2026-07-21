import { ReactNode, useState } from "react";
import { CunninghamProvider } from "../../src/components/Provider/Provider";
import { SearchFilter } from "../../src/components/search-filter/SearchFilter";
import { UserSearchFilter } from "../../src/components/search-filter/UserSearchFilter";
import {
  SearchFilterItem,
  UserSearchFilterItem,
} from "../../src/components/search-filter/types";

// Playwright CT bridges function props as one-way dispatchers whose return
// value is always `undefined`, so a controlled component like SearchFilter
// can't be driven from the test file. These helpers run in the browser and
// build the actual stateful scenario locally, mirroring the stories.

const simpleItems: SearchFilterItem[] = [
  { id: "apple", label: "Apple" },
  { id: "banana", label: "Banana" },
  { id: "cherry", label: "Cherry" },
];

interface TestSearchFilterProps {
  /** Forwarded to SearchFilter; defaults to its own default (`true`). */
  showReset?: boolean;
  isLoading?: boolean;
  emptyState?: ReactNode;
  /** Pre-selects an item so the Reset row is present on first open. */
  initialSelected?: SearchFilterItem;
}

export const TestSearchFilter = ({
  showReset,
  isLoading,
  emptyState,
  initialSelected,
}: TestSearchFilterProps) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SearchFilterItem | undefined>(
    initialSelected,
  );

  const filtered = simpleItems.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <CunninghamProvider currentLocale="en-US">
      <SearchFilter
        label="Category"
        activeLabel={selected?.label}
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search..."
        items={filtered}
        renderItem={(item) => (
          <div className="c__dropdown-menu-item">{item.label}</div>
        )}
        onItemSelect={setSelected}
        selected={selected}
        showReset={showReset}
        isLoading={isLoading}
        emptyState={emptyState}
      />
    </CunninghamProvider>
  );
};

const mockUsers: UserSearchFilterItem[] = [
  { id: "1", label: "Alice Martin", fullName: "Alice Martin" },
  { id: "2", label: "Bob Dupont", fullName: "Bob Dupont" },
];

export const TestUserSearchFilter = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<UserSearchFilterItem | undefined>();

  const filtered = mockUsers.filter((user) =>
    user.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <CunninghamProvider currentLocale="en-US">
      <UserSearchFilter
        label="Owner"
        activeLabel={selected?.fullName}
        searchValue={search}
        onSearchChange={setSearch}
        items={filtered}
        onItemSelect={setSelected}
        selected={selected}
      />
    </CunninghamProvider>
  );
};
