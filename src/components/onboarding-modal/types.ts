import { ReactNode } from "react";
import { ModalSize } from "@gouvfr-lasuite/cunningham-react";

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
  content: ReactNode;
}

export interface OnboardingModalProps {
  /** Whether the modal is open */
  isOpen: boolean;

  /** Size of the modal on desktop (default: ModalSize.LARGE). On mobile, always ModalSize.FULL */
  size?: ModalSize;

  /** Name of the application or module (e.g., "Discover Docs", "Welcome to Messaging") */
  appName?: string;

  /** Main heading of the onboarding modal (e.g., "Learn the core principles") */
  mainTitle: string;

  /** Array of onboarding steps */
  steps: OnboardingStep[];

  /** Initial step index (default: 0) */
  initialStep?: number;

  /** Optional footer link - requires either href or onClick */
  footerLink?: {
    label: string;
  } & (
    | { href: string; onClick?: () => void }
    | { onClick: () => void; href?: string }
  );

  /** Callback when user clicks Skip */
  onSkip?: () => void;

  /** Callback when user clicks Understood (last step) */
  onComplete: () => void;

  /** Callback when user clicks the close button */
  onClose: () => void;

  /** Custom labels for i18n */
  labels?: {
    skip?: string;
    next?: string;
    previous?: string;
    complete?: string;
  };
}

export interface OnboardingStepItemProps {
  /** Step data */
  step: OnboardingStep;
  /** Whether this step is active */
  isActive: boolean;
  /** Click handler */
  onClick: () => void;
  /** Step index (0-based) for accessibility */
  index: number;
  /** Total number of steps */
  totalSteps: number;
  /** Accessible label for the step */
  ariaLabel: string;
}
