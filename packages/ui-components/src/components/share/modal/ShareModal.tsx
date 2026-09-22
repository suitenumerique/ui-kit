import type { PropsWithChildren } from "react";
import { Modal, ModalSize } from ":/cunningham";
import { useCunningham } from ":/components/provider";
import { QuickSearch } from ":/components/quick-search";
import { useResponsive } from ":/hooks/useResponsive";
import { ShareImportModal } from "../import-modal/ShareImportModal";
import { ShareSearchField } from "./ShareSearchField";
import { ShareSearchResults } from "./ShareSearchResults";
import { ShareMembersSection } from "./ShareMembersSection";
import { ShareInvitationsSection } from "./ShareInvitationsSection";
import { ShareModalFooter } from "./ShareModalFooter";
import { ShareImportAction } from "./ShareImportAction";
import { useShareSearch } from "./useShareSearch";
import { useShareImport } from "./useShareImport";
import { useShareModalLayout } from "./useShareModalLayout";
import {
  getShareModalVisibility,
  ShareModalVisibilityMode,
} from "./visibility";
import type { ShareModalProps } from "./types";
import { FolderRestricted } from ":/icons";
import { IconSize } from ":/components/icon";

export type { ShareModalProps } from "./types";

export const ShareModal = <UserType, InvitationType, AccessType>({
  children,
  accesses = [],
  invitations = [],
  canUpdate = true,
  canView = true,
  hideInvitations = false,
  hideMembers = false,
  allowFileImport = false,
  allowInvitation = true,
  ...props
}: PropsWithChildren<
  ShareModalProps<UserType, InvitationType, AccessType>
>) => {
  if (!(hideInvitations && hideMembers)) {
    if (!props.invitationRoles) {
      throw new Error("invitationRoles is required");
    }
    if (!props.onSearchUsers) {
      throw new Error("onSearchUsers is required");
    }
  }
  if (!hideInvitations && !props.onInviteUser) {
    throw new Error("onInviteUser is required");
  }
  if (canUpdate && !canView) {
    throw new Error("canView cannot be false if canUpdate is true");
  }

  const { t } = useCunningham();
  const { isMobile } = useResponsive();
  const layout = useShareModalLayout(isMobile);
  const search = useShareSearch({
    onSearchUsers: props.onSearchUsers,
    onInviteUser: props.onInviteUser,
    initialRole: props.invitationRoles?.[0]?.value ?? "",
  });
  const contactImport = useShareImport({
    onImportContacts: props.onImportContacts,
    onImportFileChange: props.onImportFileChange,
  });
  const visibility = getShareModalVisibility({
    canView,
    canUpdate,
    hideMembers,
    hideInvitations,
    allowFileImport,
    canRestrict: props.canRestrict,
    isSearching: search.isSearching,
    loading: props.loading,
    membersCount: accesses.length,
    invitationsCount: invitations.length,
  });
  const searchPlaceholder =
    props.searchPlaceholder ?? t("components.share.user.placeholder");
  return (
    <>
      <Modal
        title={props.modalTitle ?? t("components.share.modalTitle")}
        isOpen={props.isOpen}
        onClose={props.onClose}
        aria-label={t("components.share.modalAriaLabel")}
        closeOnClickOutside
        size={isMobile ? ModalSize.FULL : ModalSize.LARGE}
      >
        <div className="c__share-modal no-padding">
          {visibility.mode === ShareModalVisibilityMode.RESTRICTED && (
            <div
              className="c__share-modal__cannot-view"
              style={{ height: layout.listHeight }}
            >
              <div className="c__share-modal__cannot-view__content">
                <p>
                  {props.cannotViewMessage ??
                    t("components.share.cannot_view.message")}
                </p>
              </div>
              {props.cannotViewChildren}
            </div>
          )}

          {visibility.mode === ShareModalVisibilityMode.SHARING && (
            <QuickSearch
              onFilter={search.changeInput}
              inputValue={search.inputValue}
              showInput={canUpdate}
              loading={props.loading}
              placeholder={searchPlaceholder}
              inputContent={
                <div ref={layout.searchFieldRef}>
                  <ShareSearchField
                    selectedUsers={search.selectedUsers}
                    onRemoveUser={search.removeUser}
                    inputValue={search.inputValue}
                    onInputChange={search.changeInput}
                    placeholder={searchPlaceholder}
                    loading={props.loading}
                    roles={props.invitationRoles!}
                    selectedRole={search.selectedRole}
                    onSelectRole={search.selectRole}
                    onShare={search.share}
                  />
                </div>
              }
            >
              <div style={{ height: layout.listHeight, overflowY: "auto" }}>
                {search.isSearching && (
                  <ShareSearchResults
                    results={props.searchUsersResult}
                    selectedUsers={search.selectedUsers}
                    query={search.searchQuery}
                    allowInvitation={allowInvitation}
                    groupName={props.searchGroupName}
                    onSelect={search.selectUser}
                  />
                )}
                {!search.isSearching && (
                  <>
                    {children}
                    {props.isRestricted && (
                      <div className="c__share-modal__restricted">
                        <FolderRestricted size={IconSize.SMALL} />
                        {t("components.share.restricted.message")}
                      </div>
                    )}
                  </>
                )}
                {visibility.showInvitations && (
                  <ShareInvitationsSection
                    invitations={invitations}
                    roles={props.invitationRoles!}
                    canUpdate={canUpdate}
                    onUpdateInvitation={props.onUpdateInvitation}
                    onDeleteInvitation={props.onDeleteInvitation}
                    invitationRoleTopMessage={props.invitationRoleTopMessage}
                    hasNextInvitations={props.hasNextInvitations}
                    onLoadNextInvitations={props.onLoadNextInvitations}
                  />
                )}
                {visibility.showMembers && (
                  <ShareMembersSection
                    accesses={accesses}
                    roles={props.invitationRoles!}
                    canUpdate={canUpdate}
                    getAccessRoles={props.getAccessRoles}
                    accessRoleKey={props.accessRoleKey}
                    accessRoleTopMessage={props.accessRoleTopMessage}
                    onUpdateAccess={props.onUpdateAccess}
                    onDeleteAccess={props.onDeleteAccess}
                    membersTitle={props.membersTitle}
                    renderAccessRightExtras={props.renderAccessRightExtras}
                    getAccessClassName={props.getAccessClassName}
                    renderAccessFooter={props.renderAccessFooter}
                    hasNextMembers={props.hasNextMembers}
                    onLoadNextMembers={props.onLoadNextMembers}
                    headerAction={
                      visibility.showImportAction && (
                        <ShareImportAction
                          onOpen={contactImport.open}
                          allowFileImport={visibility.allowImport}
                          canRestrict={props.canRestrict}
                          isRestricted={props.isRestricted}
                          onRestrict={props.onRestrict}
                          onUnrestrict={props.onUnrestrict}
                        />
                      )
                    }
                  />
                )}
              </div>
            </QuickSearch>
          )}

          <div ref={layout.footerRef}>
            {visibility.showFooter && (
              <ShareModalFooter
                linkSettings={props.linkSettings}
                canUpdate={canUpdate}
                linkReachChoices={props.linkReachChoices}
                onUpdateLinkReach={props.onUpdateLinkReach}
                linkReach={props.linkReach}
                linkRoleChoices={props.linkRoleChoices}
                linkRole={props.linkRole}
                onUpdateLinkRole={props.onUpdateLinkRole}
                showLinkRole={props.showLinkRole}
                customTranslations={props.customTranslations}
                topLinkReachMessage={props.topLinkReachMessage}
                topLinkRoleMessage={props.topLinkRoleMessage}
                outsideSearchContent={props.outsideSearchContent}
              />
            )}
          </div>
        </div>
      </Modal>
      {visibility.allowImport && contactImport.isOpen && (
        <ShareImportModal
          isOpen={contactImport.isOpen}
          onClose={contactImport.close}
          maxRows={props.maxImportRows}
          isImporting={contactImport.isImporting}
          // Resolve from current props so errors set by the consumer during
          // submission appear on the failing attempt.
          importError={
            contactImport.hasFailed
              ? (props.importErrorMessage ??
                t("components.share.import.import_failed"))
              : undefined
          }
          onFileChange={contactImport.changeFile}
          onImport={contactImport.submit}
        >
          {props.importModalChildren}
        </ShareImportModal>
      )}
    </>
  );
};
