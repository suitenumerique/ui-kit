import { useState } from "react";
import { CunninghamProvider } from "../../src/components/provider/Provider";
import {
  OnboardingModal,
  OnboardingModalProps,
} from "../../src/components/onboarding-modal/OnboardingModal";
import { OnboardingStep } from "../../src/components/onboarding-modal/types";

const titles = [
  "Compose",
  "Format",
  "Share",
  "Templates",
  "Settings",
  "Security",
];

const previewSteps: OnboardingStep[] = titles.map((title, index) => ({
  icon: <span className="material-icons">grid_view</span>,
  title,
  description: `${title} description`,
  content:
    index === 2 ? (
      <button>Try sharing</button>
    ) : (
      <p className="preview">{`${title} preview`}</p>
    ),
  contentAlt: index === 1 ? "Animation of the formatting toolbar" : undefined,
}));

const textOnlySteps: OnboardingStep[] = previewSteps
  .slice(0, 3)
  .map(({ icon, title, description }) => ({ icon, title, description }));

export const TestOnboardingModal = ({
  textOnly = false,
  stepCount = 3,
  footerAction = false,
  ...props
}: Partial<OnboardingModalProps> & {
  textOnly?: boolean;
  stepCount?: number;
  /** Renders the footer with onClick only, instead of a link. */
  footerAction?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState("");
  const close = (value: string) => () => {
    setResult(value);
    setIsOpen(false);
  };

  return (
    <CunninghamProvider>
      <button onClick={() => setIsOpen(true)}>Open onboarding</button>
      <output aria-label="Result">{result}</output>
      <OnboardingModal
        isOpen={isOpen}
        appName="Discover Docs"
        mainTitle="Learn the basics"
        steps={textOnly ? textOnlySteps : previewSteps.slice(0, stepCount)}
        hideContent={textOnly}
        footerLink={
          footerAction
            ? { label: "Take the tour", onClick: () => setResult("tour") }
            : { label: "Learn more", href: "https://example.com" }
        }
        onSkip={close("skipped")}
        onComplete={close("completed")}
        onClose={close("closed")}
        {...props}
      />
    </CunninghamProvider>
  );
};
