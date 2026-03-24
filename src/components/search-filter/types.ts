import { ReactNode } from "react";

export type SearchFilterItem = {
  id: string;
  label: string;
};

export type SearchFilterProps<T extends SearchFilterItem = SearchFilterItem> = {
  label: string;
  activeLabel?: string;
  isActive?: boolean;
  searchValue?: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  items: T[];
  renderItem: (item: T) => ReactNode;
  onItemSelect?: (item: T) => void;
  isLoading?: boolean;
  emptyState?: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

export type UserSearchFilterItem = SearchFilterItem & {
  fullName: string;
  email?: string;
};

export type UserSearchFilterProps = Omit<
  SearchFilterProps<UserSearchFilterItem>,
  "renderItem"
>;
