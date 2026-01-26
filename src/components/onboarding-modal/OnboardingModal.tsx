import { useState, useRef, useEffect, useCallback } from "react";
import {
  Modal,
  ModalSize,
  Button,
  useCunningham,
} from "@gouvfr-lasuite/cunningham-react";
import clsx from "clsx";
import { useResponsive } from ":/hooks/useResponsive";
import { OnboardingModalProps } from "./types";
import { OnboardingStepItem, getStepIcon } from "./OnboardingStepItem";
import "./index.scss";

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

  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stepsContainerRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  // Labels with i18n fallbacks
  const labelSkip = labels?.skip ?? t("components.onboarding.skip");
  const labelNext = labels?.next ?? t("components.onboarding.next");
  const labelPrevious =
    labels?.previous ?? t("components.onboarding.previous");
  const labelComplete = labels?.complete ?? t("components.onboarding.complete");

  // displayedStep for content (delayed), currentStep for step list highlighting (immediate)
  const activeStep = steps[displayedStep];

  /**
   * Generates accessible label for a step button.
   */
  const getStepAriaLabel = useCallback(
    (stepIndex: number, stepTitle: string) => {
      const label = t("components.onboarding.stepLabel")
        .replace("{current}", String(stepIndex + 1))
        .replace("{total}", String(steps.length))
        .replace("{title}", stepTitle);

      if (stepIndex === currentStep) {
        return label + t("components.onboarding.currentStepSuffix");
      }
      return label;
    },
    [t, steps.length, currentStep],
  );

  /**
   * Generates accessible label for the content region.
   */
  const getContentRegionLabel = useCallback(() => {
    return t("components.onboarding.contentRegionLabel")
      .replace("{current}", String(displayedStep + 1))
      .replace("{total}", String(steps.length));
  }, [t, displayedStep, steps.length]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Scroll active step into view
  useEffect(() => {
    const activeRef = stepRefs.current[currentStep];
    if (activeRef) {
      activeRef.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentStep]);

  // Reset step and manage focus when modal opens
  useEffect(() => {
    if (isOpen) {
      // Clear any pending animation timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setCurrentStep(initialStep);
      setDisplayedStep(initialStep);
      setIsFading(false);

      // Focus the initial step button after modal renders
      // Use requestAnimationFrame + setTimeout to ensure DOM is ready
      const focusTimeout = setTimeout(() => {
        requestAnimationFrame(() => {
          const stepButton = stepRefs.current[initialStep];
          if (stepButton && !isMobile) {
            stepButton.focus();
          }
        });
      }, 150);

      return () => clearTimeout(focusTimeout);
    }
  }, [isOpen, initialStep, isMobile]);

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

  // Keyboard navigation for step list (ArrowUp/ArrowDown)
  useEffect(() => {
    const container = stepsContainerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;

      const target = e.target as HTMLElement;
      if (!target.closest(".c__onboarding-modal__step")) return;

      e.preventDefault();

      const newIndex =
        e.key === "ArrowDown"
          ? (currentStep + 1) % steps.length
          : (currentStep - 1 + steps.length) % steps.length;

      handleStepChange(newIndex);

      // Focus the new step after state update
      setTimeout(() => {
        stepRefs.current[newIndex]?.focus();
      }, 0);
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, steps.length, handleStepChange]);

  const handleNext = useCallback(() => {
    if (isLastStep) {
      onComplete();
    } else {
      handleStepChange(currentStep + 1);
    }
  }, [isLastStep, onComplete, handleStepChange, currentStep]);

  const handlePrevious = useCallback(() => {
    if (!isFirstStep) {
      handleStepChange(currentStep - 1);
    }
  }, [isFirstStep, handleStepChange, currentStep]);

  const handleSkip = useCallback(() => {
    onSkip?.();
  }, [onSkip]);

  // Early return for empty steps
  if (steps.length === 0) {
    return null;
  }

  // Validate initialStep bounds
  const safeInitialStep = Math.max(0, Math.min(initialStep, steps.length - 1));
  if (safeInitialStep !== initialStep && process.env.NODE_ENV === "development") {
    console.warn(
      `OnboardingModal: initialStep (${initialStep}) is out of bounds. Using ${safeInitialStep} instead.`,
    );
  }

  const leftActions = footerLink ? (
    <a
      className="c__onboarding-modal__footer-link"
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
      {footerLink.label}
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

        <div className="c__onboarding-modal__body">
          {/* Desktop: Steps list with keyboard navigation */}
          <div
            ref={stepsContainerRef}
            className="c__onboarding-modal__steps"
            role="tablist"
            aria-orientation="vertical"
            aria-label={mainTitle}
          >
            {steps.map((step, index) => (
              <OnboardingStepItem
                key={index}
                ref={(el) => {
                  stepRefs.current[index] = el;
                }}
                step={step}
                index={index}
                totalSteps={steps.length}
                isActive={index === currentStep}
                ariaLabel={getStepAriaLabel(index, step.title)}
                onClick={() => handleStepChange(index)}
              />
            ))}
          </div>

          {/* Content zone with ARIA live region */}
          <div
            className="c__onboarding-modal__content"
            role="tabpanel"
            aria-live="polite"
            aria-atomic="true"
            aria-label={getContentRegionLabel()}
          >
            <div
              className={clsx("c__onboarding-modal__content-inner", {
                "c__onboarding-modal__content-inner--fading": isFading,
              })}
            >
              {activeStep?.content}
            </div>
          </div>

          {/* Mobile: Current step info */}
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
        </div>
      </div>
    </Modal>
  );
};
