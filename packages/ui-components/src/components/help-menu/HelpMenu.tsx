import { useMemo, useRef, useState } from "react";
import { Button } from ":/cunningham";
import { useCunningham } from ":/components/provider";
import { DropdownMenu } from "../dropdown-menu/DropdownMenu";
import { useDropdownMenu } from "../dropdown-menu/useDropdownMenu";
import { DropdownMenuItem } from "../dropdown-menu/types";
import { QuestionMark } from "../icons/QuestionMark";
import { GenericSupportForm } from "../support-form/generic-support-form/GenericSupportForm";
import {
  GenericSupportFormData,
  GenericSupportFormLabels,
  GenericSupportFormPlacement,
} from "../support-form/generic-support-form/types";
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

export type HelpMenuGenericSupportConfig = {
  onSend: (data: GenericSupportFormData) => void;
  categories?: DropdownMenuItem[];
  defaultCategory?: string;
  showEmailReply?: boolean;
  emailPrivacyUrl?: string;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
  isSending?: boolean;
  labels?: Partial<GenericSupportFormLabels>;
  placement?: GenericSupportFormPlacement;
};

export type HelpMenuProps = {
  documentationUrl?: string;
  onOnboarding?: () => void;
  onContactUs?: () => void;
  genericSupportForm?: HelpMenuGenericSupportConfig;
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
  genericSupportForm,
  release,
  legal,
  customOptions,
}: HelpMenuProps) => {
  const { t } = useCunningham();
  const { isOpen, setIsOpen } = useDropdownMenu();
  const [isSupportFormOpen, setIsSupportFormOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const supportFormAnchorRef = useRef<HTMLDivElement>(null);

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

    if (onContactUs || genericSupportForm) {
      if (items.length > 0) items.push({ type: "separator" });
      items.push({
        label: t("components.helpMenu.contactUs"),
        icon: <BubbleEdit size={IconSize.SMALL} />,
        callback: () => {
          if (genericSupportForm) {
            setIsSupportFormOpen(true);
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
    genericSupportForm,
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

      {genericSupportForm && (
        <>
          <div
            ref={supportFormAnchorRef}
            style={{
              position: "fixed",
              left: 12,
              bottom: 12,
              width: 0,
              height: 0,
              pointerEvents: "none",
            }}
          />
          <GenericSupportForm
            triggerRef={supportFormAnchorRef}
            isOpen={isSupportFormOpen}
            onOpenChange={setIsSupportFormOpen}
            placement="top start"
            shouldFlip={false}
            onSend={genericSupportForm.onSend}
            onCancel={() => setIsSupportFormOpen(false)}
            categories={genericSupportForm.categories}
            defaultCategory={genericSupportForm.defaultCategory}
            showEmailReply={genericSupportForm.showEmailReply}
            emailPrivacyUrl={genericSupportForm.emailPrivacyUrl}
            maxFileSize={genericSupportForm.maxFileSize}
            acceptedFileTypes={genericSupportForm.acceptedFileTypes}
            isSending={genericSupportForm.isSending}
            labels={genericSupportForm.labels}
          />
        </>
      )}
    </>
  );
};
