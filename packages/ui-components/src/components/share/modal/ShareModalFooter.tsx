import type { ReactNode } from "react";
import type { CustomTranslations } from ":/hooks/useCustomTranslations";
import { ShareLinkSettings } from "./items/ShareLinkSettings";
import type { ShareModalLinkSettingsProps } from "./types";

type ShareModalFooterProps = ShareModalLinkSettingsProps & {
  canUpdate: boolean;
  customTranslations?: CustomTranslations;
  outsideSearchContent?: ReactNode;
};

/** Groups link settings and consumer content shown outside the search view. */
export const ShareModalFooter = ({
  linkSettings,
  linkReachChoices,
  canUpdate,
  onUpdateLinkReach,
  linkReach,
  linkRoleChoices,
  linkRole,
  onUpdateLinkRole,
  showLinkRole,
  customTranslations,
  topLinkReachMessage,
  topLinkRoleMessage,
  outsideSearchContent,
}: ShareModalFooterProps) => (
  <div className="c__share-modal__footer">
    {linkSettings && (
      <ShareLinkSettings
        linkReachChoices={linkReachChoices}
        canUpdate={canUpdate}
        onUpdateLinkReach={onUpdateLinkReach!}
        linkReach={linkReach}
        linkRoleChoices={linkRoleChoices}
        linkRole={linkRole}
        onUpdateLinkRole={onUpdateLinkRole!}
        showLinkRole={showLinkRole}
        customTranslations={customTranslations}
        topLinkReachMessage={topLinkReachMessage}
        topLinkRoleMessage={topLinkRoleMessage}
      />
    )}
    {outsideSearchContent}
  </div>
);
