import { useMemo, useRef, useState } from "react";
import { Button } from "@gouvfr-lasuite/cunningham-react";
import { DropdownMenu } from "../dropdown-menu/DropdownMenu";
import { useDropdownMenu } from "../dropdown-menu/useDropdownMenu";
import { DropdownMenuItem } from "../dropdown-menu/types";
import { QuestionMark } from "../icons/QuestionMark";
import { FeedbackForm } from "../feedback-form/FeedbackForm";
import {
  FeedbackFormData,
  FeedbackFormLabels,
  FeedbackFormPlacement,
} from "../feedback-form/types";

export type HelpMenuRelease = {
  version: string;
  date?: string;
  url?: string;
};

export type HelpMenuFeedbackConfig = {
  onSend: (data: FeedbackFormData) => void;
  categories?: DropdownMenuItem[];
  defaultCategory?: string;
  showEmailReply?: boolean;
  emailPrivacyUrl?: string;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
  isSending?: boolean;
  labels?: Partial<FeedbackFormLabels>;
  placement?: FeedbackFormPlacement;
};

export type HelpMenuProps = {
  documentationUrl?: string;
  onOnboarding?: () => void;
  onContactUs?: () => void;
  feedbackForm?: HelpMenuFeedbackConfig;
  release?: HelpMenuRelease;
};

export const HelpMenu = ({
  documentationUrl,
  onOnboarding,
  onContactUs,
  feedbackForm,
  release,
}: HelpMenuProps) => {
  const { isOpen, setIsOpen } = useDropdownMenu();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const feedbackAnchorRef = useRef<HTMLDivElement>(null);

  const options = useMemo(() => {
    const items: DropdownMenuItem[] = [];

    if (documentationUrl) {
      items.push({
        label: "Documentation",
        icon: <span className="material-icons">article</span>,
        callback: () => {
          window.open(documentationUrl, "_blank", "noopener,noreferrer");
        },
      });
    }

    if (onOnboarding) {
      if (items.length > 0) items.push({ type: "separator" });
      items.push({
        label: "Onboarding",
        icon: <span className="material-icons">auto_fix_high</span>,
        callback: onOnboarding,
      });
    }

    if (onContactUs || feedbackForm) {
      if (items.length > 0) items.push({ type: "separator" });
      items.push({
        label: "Contact us",
        icon: <span className="material-icons">edit_note</span>,
        callback: () => {
          if (feedbackForm) {
            setIsFeedbackOpen(true);
          } else {
            onContactUs?.();
          }
        },
      });
    }

    if (release) {
      if (items.length > 0) items.push({ type: "separator" });
      const subTextParts = [release.version];
      if (release.date) subTextParts.push(release.date);

      items.push({
        label: "Latest release",
        subText: subTextParts.join(" · "),
        icon: <span className="material-icons">update</span>,
        callback: release.url
          ? () => {
              window.open(release.url, "_blank", "noopener,noreferrer");
            }
          : undefined,
      });
    }

    return items;
  }, [documentationUrl, onOnboarding, onContactUs, feedbackForm, release]);

  if (options.length === 0) return null;

  return (
    <>
      <DropdownMenu options={options} isOpen={isOpen} onOpenChange={setIsOpen}>
        <div ref={triggerRef}>
          <Button
            className="c__help-menu__trigger"
            color="neutral"
            variant="tertiary"
            size="small"
            icon={<QuestionMark />}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Help"
          />
        </div>
      </DropdownMenu>

      {feedbackForm && (
        <>
          <div
            ref={feedbackAnchorRef}
            style={{
              position: "fixed",
              left: 12,
              bottom: 12,
              width: 0,
              height: 0,
              pointerEvents: "none",
            }}
          />
          <FeedbackForm
            triggerRef={feedbackAnchorRef}
            isOpen={isFeedbackOpen}
            onOpenChange={setIsFeedbackOpen}
            placement="top start"
            shouldFlip={false}
            onSend={feedbackForm.onSend}
            onCancel={() => setIsFeedbackOpen(false)}
            categories={feedbackForm.categories}
            defaultCategory={feedbackForm.defaultCategory}
            showEmailReply={feedbackForm.showEmailReply}
            emailPrivacyUrl={feedbackForm.emailPrivacyUrl}
            maxFileSize={feedbackForm.maxFileSize}
            acceptedFileTypes={feedbackForm.acceptedFileTypes}
            isSending={feedbackForm.isSending}
            labels={feedbackForm.labels}
          />
        </>
      )}
    </>
  );
};
