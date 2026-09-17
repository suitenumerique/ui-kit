import { ReactNode } from "react";

export type TabData = {
  id: string;
  label: string;
  /** An icon element, or a Material Icon name for existing consumers. */
  icon?: ReactNode;
  /** Hide the visible label while retaining it as the accessible name. */
  iconOnly?: boolean;
  isDisabled?: boolean;
  content: ReactNode;
};
