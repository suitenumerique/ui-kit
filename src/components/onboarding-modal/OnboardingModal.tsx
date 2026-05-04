import { useState, useRef, useEffect, useCallback, useId } from "react";
import {
  Modal,
  ModalSize,
  Button,
  useCunningham,
} from "@gouvfr-lasuite/cunningham-react";
import clsx from "clsx";
import { useResponsive } from ":/hooks/useResponsive";
import { OnboardingStep } from "./types";
import { OnboardingStepItem, getStepIcon } from "./OnboardingStepItem";
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

  // currentStep = selected tab (controls panel content, aria-selected, active style).
  // focusedStep = roving tabindex target (controls which tab has tabindex=0).
  // Arrows move focusedStep only; Enter/Space/click/Next/Prev sync both.
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [focusedStep, setFocusedStep] = useState(initialStep);
  const [displayedStep, setDisplayedStep] = useState(initialStep);
  const [isFading, setIsFading] = useState(false);
  // SR: polite announcement when Next/Previous keeps focus on the button (not tabs).
  const [stepAnnouncement, setStepAnnouncement] = useState("");

  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Unique tab/panel ids per modal instance.
  const reactId = useId();
  const baseId = `onboarding-${reactId.replace(/:/g, "")}`;
  const getTabId = useCallback(
    (index: number) => `${baseId}-tab-${index + 1}`,
    [baseId],
  );
  const getPanelId = useCallback(
    (index: number) => `${baseId}-panel-${index + 1}`,
    [baseId],
  );
  const getPanelDescId = useCallback(
    (index: number) => `${baseId}-panel-desc-${index + 1}`,
    [baseId],
  );

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  // Labels with i18n fallbacks
  const labelSkip = labels?.skip ?? t("components.onboarding.skip");
  const labelNext = labels?.next ?? t("components.onboarding.next");
  const labelPrevious = labels?.previous ?? t("components.onboarding.previous");
  const labelComplete = labels?.complete ?? t("components.onboarding.complete");

  // displayedStep for content (delayed), currentStep for step list highlighting (immediate)
  const activeStep = steps[displayedStep];
  const showContentZone = !hideContent && !!activeStep?.content;

  /**
   * Accessible label for a step button. Selected state is conveyed by
   * aria-selected on the <button role="tab">; do not duplicate it here.
   */
  const getStepAriaLabel = useCallback(
    (stepIndex: number, stepTitle: string) => {
      return t("components.onboarding.stepLabel")
        .replace("{current}", String(stepIndex + 1))
        .replace("{total}", String(steps.length))
        .replace("{title}", stepTitle);
    },
    [t, steps.length],
  );

  // Next/Prev: reuses the same label for the live-region announcement.
  const buildStepAnnouncement = useCallback(
    (stepIndex: number) => {
      const step = steps[stepIndex];
      if (!step) return "";
      return getStepAriaLabel(stepIndex, step.title);
    },
    [steps, getStepAriaLabel],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reset step and manage focus when modal opens
  useEffect(() => {
    if (isOpen) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setCurrentStep(initialStep);
      setFocusedStep(initialStep);
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

  // Manual-activation vertical tablist: arrows move focus only, Enter/Space activates.
  // Avoids duplicate SR announcements on arrow keys because aria-selected stays put until activation.
  const handleTablistKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      let newFocusedIndex: number | null = null;

      switch (e.key) {
        case "ArrowDown":
          newFocusedIndex = (focusedStep + 1) % steps.length;
          break;
        case "ArrowUp":
          newFocusedIndex =
            (focusedStep - 1 + steps.length) % steps.length;
          break;
        case "Home":
          newFocusedIndex = 0;
          break;
        case "End":
          newFocusedIndex = steps.length - 1;
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          handleStepChange(focusedStep);
          // Clear stale live-region text when user activates from inside tablist
          setStepAnnouncement("");
          return;
        default:
          return;
      }

      e.preventDefault();
      // Clear stale live-region text from a previous Next/Prev action
      setStepAnnouncement("");
      setFocusedStep(newFocusedIndex);

      requestAnimationFrame(() => {
        const el = stepRefs.current[newFocusedIndex!];
        el?.focus();
        el?.scrollIntoView({ block: "nearest", inline: "nearest" });
      });
    },
    [focusedStep, steps.length, handleStepChange],
  );

  // When focus leaves the tablist, reset roving focus to the selected tab
  // so that re-entering (Shift+Tab) lands on the active tab (APG spec).
  const handleTablistBlur = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setFocusedStep(currentStep);
      }
    },
    [currentStep],
  );

  // Click on a tab: select it and sync roving focus.
  const handleTabClick = useCallback(
    (index: number) => {
      setFocusedStep(index);
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
      setFocusedStep(nextIndex);
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
      setFocusedStep(prevIndex);
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
          <h2 className="c__onboarding-modal__main-title">{mainTitle}</h2>
        </div>

        <div
          className={clsx("c__onboarding-modal__body", {
            "c__onboarding-modal__body--text-only": !showContentZone,
          })}
        >
          {/* Desktop: Steps list with keyboard navigation */}
          {/* tablist tabIndex=-1: avoids Chromium Tab stop on overflow:auto */}
          <div
            className="c__onboarding-modal__steps"
            role="tablist"
            aria-orientation="vertical"
            aria-label={mainTitle}
            tabIndex={-1}
            onKeyDown={handleTablistKeyDown}
            onBlur={handleTablistBlur}
          >
            {steps.map((step, index) => (
              <OnboardingStepItem
                key={index}
                ref={(el) => {
                  stepRefs.current[index] = el;
                }}
                step={step}
                index={index}
                isActive={index === currentStep}
                isFocused={index === focusedStep}
                ariaLabel={getStepAriaLabel(index, step.title)}
                id={getTabId(index)}
                controls={getPanelId(index)}
                onClick={() => handleTabClick(index)}
              />
            ))}
          </div>

          {/* Content zone (tabpanel) */}
          {showContentZone && (
            <div
              className="c__onboarding-modal__content"
              role="tabpanel"
              id={getPanelId(currentStep)}
              aria-labelledby={getTabId(currentStep)}
              aria-describedby={
                activeStep?.contentAlt
                  ? getPanelDescId(currentStep)
                  : undefined
              }
              tabIndex={0}
            >
              <div
                className={clsx("c__onboarding-modal__content-inner", {
                  "c__onboarding-modal__content-inner--fading": isFading,
                })}
              >
                {activeStep?.content}
              </div>
              {activeStep?.contentAlt && (
                <span
                  id={getPanelDescId(currentStep)}
                  className="c__onboarding-modal__sr-status"
                >
                  {activeStep.contentAlt}
                </span>
              )}
            </div>
          )}

          {/* Mobile: Current step info */}
          {(showContentZone || hideContent) && (
            <div className="c__onboarding-modal__mobile-step">
              <div
                className="c__onboarding-modal__mobile-step__icon"
                aria-hidden="true"
              >
                {activeStep && getStepIcon(activeStep, true)}
              </div>
              <div className="c__onboarding-modal__mobile-step__content">
                <span className="c__onboarding-modal__mobile-step__title">
                  {activeStep?.title}
                </span>
                {activeStep?.description && (
                  <span className="c__onboarding-modal__mobile-step__description">
                    {activeStep.description}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SR: step change on Next/Prev (not on tab focus). */}
        <div
          className="c__onboarding-modal__sr-status"
          role="status"
          aria-live="polite"
        >
          {stepAnnouncement}
        </div>
      </div>
    </Modal>
  );
};
