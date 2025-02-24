export type DropdownMenuOption = {
  label: string;
  icon?: string;
  callback?: () => void | Promise<unknown>;
  isDisabled?: boolean;
  showSeparator?: boolean;
  isHidden?: boolean;
  isChecked?: boolean;
  testId?: string;
};


