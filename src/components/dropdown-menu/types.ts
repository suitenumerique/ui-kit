import { ReactNode } from "react";

export type DropdownMenuOption = {
  label: string;
  icon?: ReactNode;
  callback?: () => void | Promise<unknown>;
  isDisabled?: boolean;
  showSeparator?: boolean;
  isHidden?: boolean;
  isChecked?: boolean;
  testId?: string;
  value?: string;
};
