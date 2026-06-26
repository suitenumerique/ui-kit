import { useMemo, useRef, useState } from "react";
import { Button, useCunningham } from "@gouvfr-lasuite/cunningham-react";
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
import {
  BubbleEdit,
  ClockArrowCirclepath,
  Doc,
  Scale,
  Spotlight,
} from ":/icons";
import { IconSize } from "../icon";

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
  legal?: {
    personalDataUrl?: string;
    termsOfUseUrl?: string;
    accessibilityUrl?: string;
    legalNoticeUrl?: string;
  };
  /** Custom menu items inserted between the legal submenu and the contact us item. */
  customOptions?: DropdownMenuItem[];
};

export const HelpMenu = ({
  documentationUrl,
  onOnboarding,
  onContactUs,
  feedbackForm,
  release,
  legal,
  customOptions,
}: HelpMenuProps) => {
  const { t } = useCunningham();
  const { isOpen, setIsOpen } = useDropdownMenu();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const feedbackAnchorRef = useRef<HTMLDivElement>(null);

  const options = useMemo(() => {
    const items: DropdownMenuItem[] = [];

    if (documentationUrl) {
      items.push({
        label: t("components.helpMenu.documentation"),
        icon: <Doc size={IconSize.SMALL} />,
        opensInNewWindow: true,
        callback: () => {
          window.open(documentationUrl, "_blank", "noopener,noreferrer");
        },
      });
    }

    if (onOnboarding) {
      items.push({
        label: t("components.helpMenu.onboarding"),
        icon: <Spotlight size={IconSize.SMALL} />,
        callback: onOnboarding,
      });
    }

    const legalItems: DropdownMenuItem[] = [];
    if (legal) {
      const legalLinks: { url?: string; labelKey: string }[] = [
        {
          url: legal.personalDataUrl,
          labelKey: "components.helpMenu.legal.personalData",
        },
        {
          url: legal.termsOfUseUrl,
          labelKey: "components.helpMenu.legal.termsOfUse",
        },
        {
          url: legal.accessibilityUrl,
          labelKey: "components.helpMenu.legal.accessibility",
        },
        {
          url: legal.legalNoticeUrl,
          labelKey: "components.helpMenu.legal.legalNotice",
        },
      ];

      for (const { url, labelKey } of legalLinks) {
        if (!url) continue;
        legalItems.push({
          label: t(labelKey),
          opensInNewWindow: true,
          callback: () => {
            window.open(url, "_blank", "noopener,noreferrer");
          },
        });
      }
    }

    if (legalItems.length > 0) {
      items.push({
        label: t("components.helpMenu.legal.label"),
        icon: <Scale size={IconSize.SMALL} />,
        children: legalItems,
      });
    }

    if (customOptions && customOptions.length > 0) {
      items.push(...customOptions);
    }

    if (onContactUs || feedbackForm) {
      if (items.length > 0) items.push({ type: "separator" });
      items.push({
        label: t("components.helpMenu.contactUs"),
        icon: <BubbleEdit size={IconSize.SMALL} />,
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
        label: t("components.helpMenu.latestRelease"),
        subText: subTextParts.join(" · "),
        icon: <ClockArrowCirclepath size={IconSize.SMALL} />,
        opensInNewWindow: !!release.url,
        callback: release.url
          ? () => {
              window.open(release.url, "_blank", "noopener,noreferrer");
            }
          : undefined,
      });
    }

    return items;
  }, [
    documentationUrl,
    onOnboarding,
    onContactUs,
    feedbackForm,
    release,
    legal,
    customOptions,
    t,
  ]);

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
            aria-label={t("components.helpMenu.ariaLabel")}
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
