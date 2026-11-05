import clsx from "clsx";
import { Tab } from "react-aria-components";
import { OnboardingStep } from "./types";

export interface OnboardingStepItemProps {
  /** Step data */
  step: OnboardingStep;
  /** Step index (0-based) */
  index: number;
  /** Whether this step is the selected one */
  isActive: boolean;
  /** DOM id of the step title, names the step */
  titleId: string;
  /** DOM id of the step description, describes the selected step */
  descriptionId: string;
}

/**
 * Returns the appropriate icon for the step based on active state.
 * Extracted to avoid duplication between desktop and mobile views.
 */
export const getStepIcon = (step: OnboardingStep, isActive: boolean) => {
  return isActive && step.activeIcon ? step.activeIcon : step.icon;
};

const getStepA11yProps = ({
  step,
  isActive,
  titleId,
  descriptionId,
}: OnboardingStepItemProps) => ({
  "aria-labelledby": titleId,
  "aria-describedby": isActive && step.description ? descriptionId : undefined,
});

const getStepClassName = (isActive: boolean) =>
  clsx("c__onboarding-modal__step", {
    "c__onboarding-modal__step--active": isActive,
  });

const StepContent = ({
  step,
  isActive,
  titleId,
  descriptionId,
}: OnboardingStepItemProps) => (
  <>
    <div className="c__onboarding-modal__step__icon" aria-hidden="true">
      {getStepIcon(step, isActive)}
    </div>
    <div className="c__onboarding-modal__step__content">
      <span id={titleId} className="c__onboarding-modal__step__title">
        {step.title}
      </span>
      {step.description && (
        // Collapsed descriptions stay in the DOM for the animation only.
        <div
          className="c__onboarding-modal__step__description-wrapper"
          aria-hidden={!isActive}
        >
          <span
            id={descriptionId}
            className="c__onboarding-modal__step__description"
          >
            {step.description}
          </span>
        </div>
      )}
    </div>
  </>
);

/** Step rendered as a tab, when the steps control a preview panel. */
export const OnboardingStepTab = (props: OnboardingStepItemProps) => (
  <Tab
    id={String(props.index)}
    className={getStepClassName(props.isActive)}
    data-testid={`onboarding-step-${props.index}`}
    {...getStepA11yProps(props)}
  >
    <StepContent {...props} />
  </Tab>
);

/** Step rendered as a button, when there is no preview panel (text-only). */
export const OnboardingStepButton = ({
  onClick,
  ...props
}: OnboardingStepItemProps & { onClick: () => void }) => (
  <button
    type="button"
    className={getStepClassName(props.isActive)}
    aria-current={props.isActive ? "step" : undefined}
    onClick={onClick}
    data-testid={`onboarding-step-${props.index}`}
    {...getStepA11yProps(props)}
  >
    <StepContent {...props} />
  </button>
);
