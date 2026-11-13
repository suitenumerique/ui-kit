import { useMemo, useRef, useState } from "react";
import { Button } from ":/cunningham";
import { useCunningham } from ":/components/provider";
import { DropdownMenu } from "../dropdown-menu/DropdownMenu";
import { useDropdownMenu } from "../dropdown-menu/useDropdownMenu";
import { DropdownMenuItem } from "../dropdown-menu/types";
import { QuestionMark } from "../icons/QuestionMark";
import { GenericSupportForm } from "../support-form/generic-support-form/GenericSupportForm";
import { GenericSupportFormProps } from "../support-form/generic-support-form/types";
import { LaSuiteSupportForm } from "../support-form/la-suite-support-form/LaSuiteSupportForm";
import { LaSuiteSupportFormProps } from "../support-form/la-suite-support-form/types";
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

// The HelpMenu opens the support forms itself and anchors them to the
// bottom-left corner, so apps can't set these props.
type SupportFormPropsSetByHelpMenu =
  | "isOpen"
  | "onOpenChange"
  | "triggerRef"
  | "children"
  | "shouldFlip";

/** Every GenericSupportForm prop, except the ones the HelpMenu sets. */
export type HelpMenuGenericSupportConfig = Omit<
  GenericSupportFormProps,
  SupportFormPropsSetByHelpMenu
>;

/** Every LaSuiteSupportForm prop, except the ones the HelpMenu sets. */
export type HelpMenuLaSuiteSupportConfig = Omit<
  LaSuiteSupportFormProps,
  SupportFormPropsSetByHelpMenu
>;

export type HelpMenuProps = {
  documentationUrl?: string;
  onOnboarding?: () => void;
  onContactUs?: () => void;
  genericSupportForm?: HelpMenuGenericSupportConfig;
  /**
   * Open a LaSuiteSupportForm, wired to the La Suite support API, from "Contact us".
   * Takes precedence over `genericSupportForm`.
   */
  laSuiteSupportForm?: HelpMenuLaSuiteSupportConfig;
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
  laSuiteSupportForm,
  release,
  legal,
  customOptions,
}: HelpMenuProps) => {
  const { t } = useCunningham();
  const { isOpen, setIsOpen } = useDropdownMenu();
  const [isSupportFormOpen, setIsSupportFormOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const supportFormAnchorRef = useRef<HTMLDivElement>(null);
  const hasContactForm = !!(laSuiteSupportForm || genericSupportForm);

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

    if (onContactUs || hasContactForm) {
      if (items.length > 0) items.push({ type: "separator" });
      items.push({
        label: t("components.helpMenu.contactUs"),
        icon: <BubbleEdit size={IconSize.SMALL} />,
        callback: () => {
          if (hasContactForm) {
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
    hasContactForm,
    release,
    legal,
    customOptions,
    t,
  ]);

  if (options.length === 0) return null;

  // Set last on the forms, so an app's config can't override them.
  const supportFormProps = {
    triggerRef: supportFormAnchorRef,
    isOpen: isSupportFormOpen,
    onOpenChange: setIsSupportFormOpen,
    shouldFlip: false,
  };

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

      {hasContactForm && (
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
      )}
      {laSuiteSupportForm ? (
        <LaSuiteSupportForm
          {...laSuiteSupportForm}
          placement={laSuiteSupportForm.placement ?? "top start"}
          {...supportFormProps}
        />
      ) : (
        genericSupportForm && (
          <GenericSupportForm
            {...genericSupportForm}
            placement={genericSupportForm.placement ?? "top start"}
            {...supportFormProps}
          />
        )
      )}
    </>
  );
};
