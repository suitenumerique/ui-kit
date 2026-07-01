import { useEffect, useRef, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { CunninghamProvider } from ":/components/Provider/Provider";
import { SearchFilter } from "./SearchFilter";
import { UserSearchFilter } from "./UserSearchFilter";
import { SearchFilterItem, UserSearchFilterItem } from "./types";
import { MenuItemBody } from "../menu";

const meta: Meta<typeof SearchFilter> = {
  title: "Components/SearchFilter",
  component: SearchFilter,
  argTypes: {
    label: {
      description: "Text shown on the trigger button.",
      table: { type: { summary: "string" } },
    },
    activeLabel: {
      description:
        "Selected value; renders as `label : activeLabel` and marks the " +
        "trigger active.",
      table: { type: { summary: "string" } },
    },
    isActive: {
      description: "Force the active style independently of `activeLabel`.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "!!activeLabel" },
      },
    },
    searchValue: {
      description: "Controlled value of the search input.",
      table: { type: { summary: "string" }, defaultValue: { summary: '""' } },
    },
    onSearchChange: {
      description: "Called on every input change. Required.",
      table: { type: { summary: "(value: string) => void" } },
    },
    placeholder: {
      description: "Placeholder / accessible label for the search input.",
      table: { type: { summary: "string" } },
    },
    items: {
      description: "Items to render in the list (already filtered by you).",
      control: false,
      table: { type: { summary: "T[]" } },
    },
    renderItem: {
      description: "Renders a single result row.",
      control: false,
      table: { type: { summary: "(item: T) => ReactNode" } },
    },
    onItemSelect: {
      description: "Called with the picked item, or `undefined` when reset.",
      table: { type: { summary: "(item?: T) => void" } },
    },
    selected: {
      description: "Currently selected item; enables the reset entry.",
      control: false,
      table: { type: { summary: "T" } },
    },
    isLoading: {
      description: "Shows a spinner instead of the list.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    emptyState: {
      description: "Shown when `items` is empty and not loading.",
      control: false,
      table: { type: { summary: "ReactNode" } },
    },
    isOpen: {
      description: "Controls the popover open state.",
      table: { type: { summary: "boolean" } },
    },
    onOpenChange: {
      description: "Called when the popover opens or closes.",
      table: { type: { summary: "(isOpen: boolean) => void" } },
    },
    showReset: {
      description:
        "Whether to show the reset entry when an item is selected.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
  },
  decorators: [
    (Story) => (
      <CunninghamProvider>
        <Story />
      </CunninghamProvider>
    ),
  ],
};

export default meta;

const simpleItems: SearchFilterItem[] = [
  { id: "1", label: "Option A" },
  { id: "2", label: "Option B" },
  { id: "3", label: "Option C" },
  { id: "4", label: "Option D" },
];

export const Basic: StoryObj = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [search, setSearch] = useState("");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selected, setSelected] = useState<SearchFilterItem>();

    const filtered = simpleItems.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase()),
    );

    return (
      <SearchFilter
        label="Category"
        activeLabel={selected?.label}
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search..."
        items={filtered}
        renderItem={(item) => (
          <div className="c__dropdown-menu-item">
            <MenuItemBody label={item.label} />
          </div>
        )}
        onItemSelect={(item) => {
          setSelected(item);
        }}
        selected={selected}
      />
    );
  },
};

const mockUsers: UserSearchFilterItem[] = [
  { id: "1", label: "Benoît Savi", fullName: "Benoît Savi" },
  { id: "2", label: "Camille Laurent", fullName: "Camille Laurent" },
  { id: "3", label: "Damien Soulié", fullName: "Damien Soulié" },
  { id: "4", label: "Élodie Simon", fullName: "Élodie Simon" },
  { id: "5", label: "François Sabourin", fullName: "François Sabourin" },
];

const manyUsers: UserSearchFilterItem[] = [
  { id: "1", label: "Alice Martin", fullName: "Alice Martin" },
  { id: "2", label: "Benoît Savi", fullName: "Benoît Savi" },
  { id: "3", label: "Camille Laurent", fullName: "Camille Laurent" },
  { id: "4", label: "Damien Soulié", fullName: "Damien Soulié" },
  { id: "5", label: "Élodie Simon", fullName: "Élodie Simon" },
  { id: "6", label: "François Sabourin", fullName: "François Sabourin" },
  { id: "7", label: "Gabriel Dupont", fullName: "Gabriel Dupont" },
  { id: "8", label: "Hélène Moreau", fullName: "Hélène Moreau" },
  { id: "9", label: "Isabelle Girard", fullName: "Isabelle Girard" },
  { id: "10", label: "Julien Petit", fullName: "Julien Petit" },
  { id: "11", label: "Karine Lefebvre", fullName: "Karine Lefebvre" },
  { id: "12", label: "Lucas Bernard", fullName: "Lucas Bernard" },
  { id: "13", label: "Marie Dubois", fullName: "Marie Dubois" },
  { id: "14", label: "Nicolas Roux", fullName: "Nicolas Roux" },
  { id: "15", label: "Olivia Fournier", fullName: "Olivia Fournier" },
  { id: "16", label: "Pierre Leroy", fullName: "Pierre Leroy" },
  { id: "17", label: "Quentin Morel", fullName: "Quentin Morel" },
  { id: "18", label: "Rachel Garnier", fullName: "Rachel Garnier" },
  { id: "19", label: "Sébastien Faure", fullName: "Sébastien Faure" },
  { id: "20", label: "Théo Mercier", fullName: "Théo Mercier" },
];

export const UserSearch: StoryObj = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [search, setSearch] = useState("");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selected, setSelected] = useState<UserSearchFilterItem>();

    const filtered = mockUsers.filter((user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase()),
    );

    return (
      <UserSearchFilter
        label="Owner"
        activeLabel={selected?.fullName}
        searchValue={search}
        onSearchChange={setSearch}
        items={filtered}
        onItemSelect={(user) => {
          setSelected(user);
        }}
        selected={selected}
      />
    );
  },
};

export const Loading: StoryObj = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [search, setSearch] = useState("");

    return (
      <UserSearchFilter
        label="Owner"
        searchValue={search}
        onSearchChange={setSearch}
        items={[]}
        isLoading={true}
      />
    );
  },
};

export const ManyUsers: StoryObj = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [search, setSearch] = useState("");
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selected, setSelected] = useState<UserSearchFilterItem>();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isLoading, setIsLoading] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [results, setResults] = useState<UserSearchFilterItem[]>(manyUsers);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      clearTimeout(debounceRef.current);

      if (!search) {
        setIsLoading(false);
        setResults(manyUsers);
        return;
      }

      setIsLoading(true);
      setResults([]);

      debounceRef.current = setTimeout(() => {
        setResults(
          manyUsers.filter((user) =>
            user.fullName.toLowerCase().includes(search.toLowerCase()),
          ),
        );
        setIsLoading(false);
      }, 800);
    }, [search]);

    return (
      <UserSearchFilter
        label="Owner"
        activeLabel={selected?.fullName}
        searchValue={search}
        onSearchChange={setSearch}
        items={results}
        isLoading={isLoading}
        emptyState="No users found"
        onItemSelect={(user) => {
          setSelected(user);
        }}
        selected={selected}
      />
    );
  },
};

export const Empty: StoryObj = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [search, setSearch] = useState("zzz");

    return (
      <UserSearchFilter
        label="Owner"
        searchValue={search}
        onSearchChange={setSearch}
        items={[]}
        emptyState="No users found"
      />
    );
  },
};
