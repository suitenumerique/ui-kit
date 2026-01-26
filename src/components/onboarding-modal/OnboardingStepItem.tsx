import { forwardRef } from "react";
import clsx from "clsx";
import { OnboardingStep } from "./types";

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

/**
 * Returns the appropriate icon for the step based on active state.
 * Extracted to avoid duplication between desktop and mobile views.
 */
export const getStepIcon = (step: OnboardingStep, isActive: boolean) => {
  return isActive && step.activeIcon ? step.activeIcon : step.icon;
};

export const OnboardingStepItem = forwardRef<
  HTMLButtonElement,
  OnboardingStepItemProps
>(({ step, isActive, onClick, index, ariaLabel }, ref) => {
  const displayedIcon = getStepIcon(step, isActive);

  return (
    <button
      ref={ref}
      type="button"
      className={clsx("c__onboarding-modal__step", {
        "c__onboarding-modal__step--active": isActive,
      })}
      onClick={onClick}
      aria-current={isActive ? "step" : undefined}
      aria-label={ariaLabel}
      tabIndex={isActive ? 0 : -1}
      data-testid={`onboarding-step-${index}`}
    >
      <div className="c__onboarding-modal__step__icon" aria-hidden="true">
        {displayedIcon}
      </div>
      <div className="c__onboarding-modal__step__content">
        <span className="c__onboarding-modal__step__title">{step.title}</span>
        {isActive && step.description && (
          <span className="c__onboarding-modal__step__description">
            {step.description}
          </span>
        )}
      </div>
    </button>
  );
});

OnboardingStepItem.displayName = "OnboardingStepItem";
