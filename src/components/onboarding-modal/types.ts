import { ReactNode } from "react";

export interface OnboardingStep {
  /** Icon displayed next to the step title */
  icon: ReactNode;
  /** Icon displayed when the step is active (optional, defaults to icon with brand color) */
  activeIcon?: ReactNode;
  /** Step title */
  title: string;
  /** Step description, visible only when the step is active */
  description?: string;
  /** Content displayed in the preview zone (image, video, component, etc.) */
  content?: ReactNode;
}
