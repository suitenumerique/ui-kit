import { ReactNode } from "react";

export interface ReleaseNoteStep {
  /** Icon displayed next to the step title */
  icon: ReactNode;
  /** Icon displayed when the step is active */
  activeIcon?: ReactNode;
  /** Step title */
  title: string;
  /** Step description, visible only when the step is active */
  description?: string;
}
