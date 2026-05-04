import { forwardRef } from "react";
import clsx from "clsx";
import { OnboardingStep } from "./types";

export interface OnboardingStepItemProps {
  /** Step data */
  step: OnboardingStep;
  /** Whether this step is the selected (active) tab */
  isActive: boolean;
  /** Whether this tab currently owns the roving tabindex (0 vs -1) */
  isFocused: boolean;
  /** Click handler */
  onClick: () => void;
  /** Step index (0-based) for accessibility */
  index: number;
  /** Accessible label for the step */
  ariaLabel: string;
  /** DOM id for this tab (`aria-labelledby` on panel) */
  id: string;
  /** Panel id for `aria-controls` */
  controls: string;
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
>(
  (
    { step, isActive, isFocused, onClick, index, ariaLabel, id, controls },
    ref,
  ) => {
    const displayedIcon = getStepIcon(step, isActive);

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={id}
        aria-controls={controls}
        aria-selected={isActive}
        aria-label={ariaLabel}
        tabIndex={isFocused ? 0 : -1}
        className={clsx("c__onboarding-modal__step", {
          "c__onboarding-modal__step--active": isActive,
        })}
        onClick={onClick}
        data-testid={`onboarding-step-${index}`}
      >
        <div className="c__onboarding-modal__step__icon" aria-hidden="true">
          {displayedIcon}
        </div>
        <div className="c__onboarding-modal__step__content">
          <span className="c__onboarding-modal__step__title">
            {step.title}
          </span>
          {step.description && (
            <div className="c__onboarding-modal__step__description-wrapper">
              <span className="c__onboarding-modal__step__description">
                {step.description}
              </span>
            </div>
          )}
        </div>
      </button>
    );
  },
);

OnboardingStepItem.displayName = "OnboardingStepItem";
