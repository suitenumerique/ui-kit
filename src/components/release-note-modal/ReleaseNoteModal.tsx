import {
  ModalSize,
  OnboardingModal,
  OnboardingModalProps,
} from "../onboarding-modal";
import { ReleaseNoteStep } from "./types";

export interface ReleaseNoteModalProps extends Omit<
  OnboardingModalProps,
  "hideContent" | "steps"
> {
  steps: ReleaseNoteStep[];
}

export const ReleaseNoteModal = ({
  steps,
  ...props
}: ReleaseNoteModalProps) => {
  return (
    <OnboardingModal
      {...props}
      steps={steps}
      size={ModalSize.MEDIUM}
      hideContent
    />
  );
};
