import { ReactNode } from "react";

export type QuickSearchAction = {
  onSelect?: () => void; // for the keyboard selection with <Command.Item
  content: ReactNode;
};

export type QuickSearchData<T> = {
  groupName: string; // The name of the group
  elements: T[]; // The elements to display
  emptyString?: string; // If no elements, show this string
  startActions?: QuickSearchAction[]; // Before all elements
  endActions?: QuickSearchAction[]; // After all elements
  showWhenEmpty?: boolean; // If no elements, show this group
};
