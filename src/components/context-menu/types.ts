import { ReactNode } from "react";

export type ContextMenuItemAction = {
  id?: string;
  label: string;
  subText?: string;
  icon?: ReactNode;
  onAction: () => void;
  disabled?: boolean;
  hidden?: boolean;
  variant?: "default" | "danger";
};

export type ContextMenuItemSeparator = {
  type: "separator";
};

export type ContextMenuItem = ContextMenuItemAction | ContextMenuItemSeparator;

export type ContextMenuProps<T = unknown> = {
  children: ReactNode;
  menu: ContextMenuItem[] | ((context: T) => ContextMenuItem[]);
  context?: T;
  disabled?: boolean;
  asChild?: boolean;
};

export type ContextMenuState = {
  isOpen: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
};

export type ContextMenuContextValue = {
  open: (config: { position: { x: number; y: number }; items: ContextMenuItem[] }) => void;
  close: () => void;
};
