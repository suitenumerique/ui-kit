import {
  ReactNode,
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
  useId,
} from "react";
import {
  Tabs,
  TabList,
  TabListStateContext,
  TabPanel,
} from "react-aria-components";
import {
  Modal,
  ModalSize,
  Button,
} from ":/cunningham";
import { useCunningham } from ":/components/provider";
import clsx from "clsx";
import { useResponsive } from ":/hooks/useResponsive";
import { OnboardingStep } from "./types";
import {
  OnboardingStepButton,
  OnboardingStepTab,
  getStepIcon,
} from "./OnboardingStepItem";
import "./index.scss";

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

  /** Hide the content/preview zone (text-only mode) */
  hideContent?: boolean;

  /** Custom labels for i18n */
  labels?: {
    skip?: string;
    next?: string;
    previous?: string;
    complete?: string;
  };
}

/** Animation duration in ms - must match CSS transition duration */
const TRANSITION_DURATION_MS = 200;

/**
 * Tab list that brings the roving focus back to the selected tab when the
 * focus leaves it, so that tabbing back in lands on the selected step even
 * after the arrows moved the focus elsewhere without activating.
 */
const StepTabList = ({
  labelledBy,
  children,
}: {
  labelledBy: string;
  children: ReactNode;
}) => {
  const state = useContext(TabListStateContext);
  const stateRef = useRef(state);
  stateRef.current = state;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleFocusOut = (e: FocusEvent) => {
      const current = stateRef.current;
      if (!current || el.contains(e.relatedTarget as Node | null)) return;
      current.selectionManager.setFocusedKey(current.selectedKey);
    };
    el.addEventListener("focusout", handleFocusOut);
    return () => el.removeEventListener("focusout", handleFocusOut);
  }, []);

  return (
    <TabList
      ref={ref}
      className="c__onboarding-modal__steps"
      aria-labelledby={labelledBy}
    >
      {children}
    </TabList>
  );
};

export const OnboardingModal = ({
  isOpen,
  size = ModalSize.LARGE,
  appName,
  mainTitle,
  steps,
  initialStep = 0,
  footerLink,
  hideContent,
  onSkip,
  onComplete,
  onClose,
  labels,
}: OnboardingModalProps) => {
  const { t } = useCunningham();
  const { isMobile } = useResponsive();

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [displayedStep, setDisplayedStep] = useState(initialStep);
  const [isFading, setIsFading] = useState(false);
  // Next and Previous keep the focus on themselves: the step change is
  // announced through a status region instead.
  const [stepAnnouncement, setStepAnnouncement] = useState("");

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const id = useId();
  const headingId = `${id}-heading`;
  const contentAltId = `${id}-content-alt`;
  const getStepTitleId = (index: number) => `${id}-step-${index}-title`;
  const getStepDescriptionId = (index: number) =>
    `${id}-step-${index}-description`;

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  // Labels with i18n fallbacks
  const labelSkip = labels?.skip ?? t("components.onboarding.skip");
  const labelNext = labels?.next ?? t("components.onboarding.next");
  const labelPrevious = labels?.previous ?? t("components.onboarding.previous");
  const labelComplete = labels?.complete ?? t("components.onboarding.complete");

  // displayedStep for content (delayed), currentStep for step list highlighting (immediate)
  const activeStep = steps[displayedStep];
  // Steps are tabs only when they control a preview panel.
  const hasPreview = !hideContent && steps.some((step) => !!step.content);

  const buildStepAnnouncement = useCallback(
    (stepIndex: number) => {
      const step = steps[stepIndex];
      if (!step) return "";
      return t("components.onboarding.stepLabel")
        .replace("{current}", String(stepIndex + 1))
        .replace("{total}", String(steps.length))
        .replace("{title}", step.title);
    },
    [t, steps],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setCurrentStep(initialStep);
      setDisplayedStep(initialStep);
      setIsFading(false);
      setStepAnnouncement("");
    }
  }, [isOpen, initialStep]);

  // Activates a step: updates selection + panel content (with fade animation).
  const handleStepChange = useCallback(
    (newStep: number) => {
      if (newStep === currentStep) return;

      // Clear any pending timeout to prevent race conditions
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Fade out, change step highlight immediately
      setIsFading(true);
      setCurrentStep(newStep);

      // After fade out, update displayed content and fade in
      timeoutRef.current = setTimeout(() => {
        setDisplayedStep(newStep);
        setIsFading(false);
        timeoutRef.current = null;
      }, TRANSITION_DURATION_MS);
    },
    [currentStep],
  );

  // The focus is on the step itself: nothing to announce.
  const handleStepSelect = useCallback(
    (index: number) => {
      handleStepChange(index);
      setStepAnnouncement("");
    },
    [handleStepChange],
  );

  const handleNext = useCallback(() => {
    if (isLastStep) {
      onComplete();
    } else {
      const nextIndex = currentStep + 1;
      handleStepChange(nextIndex);
      setStepAnnouncement(buildStepAnnouncement(nextIndex));
    }
  }, [
    isLastStep,
    onComplete,
    handleStepChange,
    currentStep,
    buildStepAnnouncement,
  ]);

  const handlePrevious = useCallback(() => {
    if (!isFirstStep) {
      const prevIndex = currentStep - 1;
      handleStepChange(prevIndex);
      setStepAnnouncement(buildStepAnnouncement(prevIndex));
    }
  }, [isFirstStep, handleStepChange, currentStep, buildStepAnnouncement]);

  const handleSkip = useCallback(() => {
    onSkip?.();
  }, [onSkip]);

  // Early return for empty steps
  if (steps.length === 0) {
    return null;
  }

  // Validate initialStep bounds
  const safeInitialStep = Math.max(0, Math.min(initialStep, steps.length - 1));
  if (
    safeInitialStep !== initialStep &&
    process.env.NODE_ENV === "development"
  ) {
    console.warn(
      `OnboardingModal: initialStep (${initialStep}) is out of bounds. Using ${safeInitialStep} instead.`,
    );
  }

  const leftActions = footerLink ? (
    <a
      className="c__onboarding-modal__footer-link"
      target="_blank"
      href={footerLink.href}
      onClick={(e) => {
        if (footerLink.onClick) {
          if (!footerLink.href) {
            e.preventDefault();
          }
          footerLink.onClick();
        }
      }}
    >
      <span className="material-icons" aria-hidden="true">
        info
      </span>
      <span className="c__onboarding-modal__footer-link__label">
        {footerLink.label}
      </span>
    </a>
  ) : undefined;

  // The step list is hidden on small screens: this replaces it.
  const mobileStep = activeStep && (
    <div className="c__onboarding-modal__mobile-step">
      <div className="c__onboarding-modal__mobile-step__icon" aria-hidden="true">
        {getStepIcon(activeStep, true)}
      </div>
      <div className="c__onboarding-modal__mobile-step__content">
        <span className="c__onboarding-modal__mobile-step__title">
          {activeStep.title}
        </span>
        {activeStep.description && (
          <span className="c__onboarding-modal__mobile-step__description">
            {activeStep.description}
          </span>
        )}
      </div>
    </div>
  );

  const rightActions = (
    <>
      {/* Mobile: Previous button */}
      {isMobile && !isFirstStep && (
        <Button
          variant="secondary"
          onClick={handlePrevious}
          data-testid="onboarding-previous"
        >
          {labelPrevious}
        </Button>
      )}

      {/* Skip button */}
      {onSkip && (
        <Button
          variant="tertiary"
          onClick={handleSkip}
          data-testid="onboarding-skip"
        >
          {labelSkip}
        </Button>
      )}

      {/* Next / Understood button */}
      <Button
        variant="primary"
        onClick={handleNext}
        data-testid="onboarding-next"
      >
        {isLastStep ? labelComplete : labelNext}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={isMobile ? ModalSize.FULL : size}
      closeOnClickOutside
      title=""
      aria-label={mainTitle}
      leftActions={leftActions}
      rightActions={rightActions}
    >
      <div className="c__onboarding-modal" data-testid="onboarding-modal">
        <div className="c__onboarding-modal__header">
          {appName && (
            <div className="c__onboarding-modal__app-name">{appName}</div>
          )}
          <h2 id={headingId} className="c__onboarding-modal__main-title">
            {mainTitle}
          </h2>
        </div>

        {hasPreview ? (
          <Tabs
            className="c__onboarding-modal__body"
            orientation="vertical"
            keyboardActivation="manual"
            selectedKey={String(currentStep)}
            onSelectionChange={(key) => handleStepSelect(Number(key))}
          >
            <StepTabList labelledBy={headingId}>
              {steps.map((step, index) => (
                <OnboardingStepTab
                  key={index}
                  step={step}
                  index={index}
                  isActive={index === currentStep}
                  titleId={getStepTitleId(index)}
                  descriptionId={getStepDescriptionId(index)}
                />
              ))}
            </StepTabList>

            <TabPanel
              id={String(currentStep)}
              className="c__onboarding-modal__content"
              aria-describedby={
                activeStep?.contentAlt ? contentAltId : undefined
              }
            >
              <div
                className={clsx("c__onboarding-modal__content-inner", {
                  "c__onboarding-modal__content-inner--fading": isFading,
                })}
              >
                {activeStep?.content}
              </div>
              {activeStep?.contentAlt && (
                <span id={contentAltId} className="c__onboarding-modal__sr-only">
                  {activeStep.contentAlt}
                </span>
              )}
            </TabPanel>

            {mobileStep}
          </Tabs>
        ) : (
          <div className="c__onboarding-modal__body c__onboarding-modal__body--text-only">
            {/* Safari drops the list semantics of unstyled lists. */}
            <ol
              className="c__onboarding-modal__steps"
              role="list"
              aria-labelledby={headingId}
            >
              {steps.map((step, index) => (
                <li key={index}>
                  <OnboardingStepButton
                    step={step}
                    index={index}
                    isActive={index === currentStep}
                    titleId={getStepTitleId(index)}
                    descriptionId={getStepDescriptionId(index)}
                    onClick={() => handleStepSelect(index)}
                  />
                </li>
              ))}
            </ol>

            {mobileStep}
          </div>
        )}

        <div
          className="c__onboarding-modal__sr-only"
          role="status"
          aria-live="polite"
        >
          {stepAnnouncement}
        </div>
      </div>
    </Modal>
  );
};
