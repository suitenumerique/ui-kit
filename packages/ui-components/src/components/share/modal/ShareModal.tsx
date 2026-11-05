import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import { Modal, ModalSize } from ":/cunningham";
import { useCunningham } from ":/components/provider";
import { QuickSearch } from ":/components/quick-search";
import { useResponsive } from ":/hooks/useResponsive";
import { ShareImportModal } from "../import-modal/ShareImportModal";
import { ShareSearchField } from "./ShareSearchField";
import { ShareSearchResults } from "./ShareSearchResults";
import { ShareMembersSection } from "./ShareMembersSection";
import { ShareAccessRequestsSection } from "./ShareAccessRequestsSection";
import { ShareInvitationsSection } from "./ShareInvitationsSection";
import { ShareModalFooter } from "./ShareModalFooter";
import { ShareMembersActions, ShareAccessAction } from "./ShareMembersActions";
import { ShareAccessConfirmationModal } from "./ShareAccessConfirmationModal";
import { useShareSearch } from "./useShareSearch";
import { useShareImport } from "./useShareImport";
import { useShareModalLayout } from "./useShareModalLayout";
import { useAccessRequestFocus } from "./useAccessRequestFocus";
import {
  getShareModalVisibility,
  ShareModalVisibilityMode,
} from "./visibility";
import type {
  AccessData,
  AccessRequestData,
  InvitationData,
  UserData,
} from "../types";
import type { ShareModalProps } from "./types";
import { getRoleLabel, getUserDisplayName } from "../labels";
import { FolderRestricted } from ":/icons";
import { IconSize } from ":/components/icon";

export type { ShareModalProps } from "./types";

export const ShareModal = <
  UserType,
  InvitationType,
  AccessType,
  AccessRequestType = object,
>({
  children,
  accesses = [],
  invitations = [],
  accessRequests = [],
  canUpdate = true,
  canView = true,
  hideInvitations = false,
  hideMembers = false,
  allowFileImport = false,
  allowInvitation = true,
  ...props
}: PropsWithChildren<
  ShareModalProps<UserType, InvitationType, AccessType, AccessRequestType>
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
  // Owned here so a refetch unmounting the members header cannot close it.
  const [accessAction, setAccessAction] = useState<ShareAccessAction>();
  const menuActionHandler = props.isRestricted
    ? props.onUnrestrict
    : props.onRestrict;
  const canChangeAccess = Boolean(props.canRestrict && menuActionHandler);
  // Resolved from the confirmed action so the label and callback cannot diverge
  // if `isRestricted` changes while the confirmation is open.
  const accessActionHandler =
    accessAction === "restrict" ? props.onRestrict : props.onUnrestrict;
  const visibility = getShareModalVisibility({
    canView,
    canUpdate,
    hideMembers,
    hideInvitations,
    allowFileImport,
    canRestrict: canChangeAccess,
    isSearching: search.isSearching,
    loading: props.loading,
    membersCount: accesses.length,
    invitationsCount: invitations.length,
    accessRequestsCount: accessRequests.length,
    hasAccessRequestActions: Boolean(
      props.onAcceptAccessRequest || props.onRejectAccessRequest,
    ),
  });
  const searchPlaceholder =
    props.searchPlaceholder ?? t("components.share.user.placeholder");
  const [announcement, setAnnouncement] = useState("");
  const announceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The menu close announcement can swallow a message set in the same turn.
  const announce = (message: string) => {
    if (announceTimeoutRef.current !== null) {
      clearTimeout(announceTimeoutRef.current);
    }
    setAnnouncement("");
    announceTimeoutRef.current = setTimeout(() => {
      announceTimeoutRef.current = null;
      setAnnouncement(message);
    }, 250);
  };
  useEffect(
    () => () => {
      if (announceTimeoutRef.current !== null) {
        clearTimeout(announceTimeoutRef.current);
      }
    },
    [],
  );
  const focusSearchInput = () => {
    requestAnimationFrame(() => {
      layout.searchField
        ?.querySelector<HTMLInputElement>(
          "input.c__share-modal__search-field__input",
        )
        ?.focus();
    });
  };
  const handleSelectUser = (user: UserData<UserType>) => {
    search.selectUser(user);
    announce(
      t("components.share.user.added", {
        name: getUserDisplayName(user),
      }),
    );
    focusSearchInput();
  };
  const handleRemoveUser = (user: UserData<UserType>) => {
    search.removeUser(user);
    announce(
      t("components.share.user.removed", {
        name: getUserDisplayName(user),
      }),
    );
    focusSearchInput();
  };
  const handleUpdateInvitation = (
    invitation: InvitationData<UserType, InvitationType>,
    role: string,
  ) => {
    if (!props.onUpdateInvitation || invitation.role === role) return;
    props.onUpdateInvitation(invitation, role);
    const roleLabel = getRoleLabel(props.invitationRoles ?? [], role) ?? role;
    announce(
      t("components.share.access.role_changed", {
        name: invitation.email,
        role: roleLabel,
      }),
    );
  };
  const handleUpdateAccess = (
    access: AccessData<UserType, AccessType>,
    role: string,
  ) => {
    const roleKey = props.accessRoleKey ?? "role";
    if (!props.onUpdateAccess || access[roleKey] === role) return;
    props.onUpdateAccess(access, role);
    const accessRoles =
      props.getAccessRoles?.(access) ?? props.invitationRoles ?? [];
    const roleLabel = getRoleLabel(accessRoles, role) ?? role;
    announce(
      t("components.share.access.role_changed", {
        name: getUserDisplayName(access.user),
        role: roleLabel,
      }),
    );
  };
  const requestFocus = useAccessRequestFocus(accessRequests, focusSearchInput);
  const handleAcceptAccessRequest = (
    request: AccessRequestData<UserType, AccessRequestType>,
    role: string,
  ) => {
    if (!props.onAcceptAccessRequest) return;
    requestFocus.track(request.id);
    props.onAcceptAccessRequest(request, role);
    announce(
      t("components.share.access_requests.accepted", {
        name: getUserDisplayName(request.user),
      }),
    );
  };
  const handleRejectAccessRequest = (
    request: AccessRequestData<UserType, AccessRequestType>,
  ) => {
    if (!props.onRejectAccessRequest) return;
    requestFocus.track(request.id);
    props.onRejectAccessRequest(request);
    announce(
      t("components.share.access_requests.rejected", {
        name: getUserDisplayName(request.user),
      }),
    );
  };
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
          <div
            className="c__share-modal__sr-status"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {announcement}
          </div>
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
              label={searchPlaceholder}
              placeholder={searchPlaceholder}
              inputContent={
                <div ref={layout.searchFieldRef}>
                  <ShareSearchField
                    selectedUsers={search.selectedUsers}
                    onRemoveUser={handleRemoveUser}
                    inputValue={search.inputValue}
                    onInputChange={search.changeInput}
                    placeholder={searchPlaceholder}
                    loading={props.loading}
                    shareButtonLabel={props.shareButtonLabel}
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
                    onSelect={handleSelectUser}
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
                {visibility.showAccessRequests && (
                  <ShareAccessRequestsSection
                    accessRequests={accessRequests}
                    roles={props.invitationRoles!}
                    canAccept={Boolean(props.onAcceptAccessRequest)}
                    canReject={Boolean(props.onRejectAccessRequest)}
                    onAccept={handleAcceptAccessRequest}
                    onReject={handleRejectAccessRequest}
                    hasNextAccessRequests={props.hasNextAccessRequests}
                    onLoadNextAccessRequests={props.onLoadNextAccessRequests}
                    listRef={requestFocus.listRef}
                  />
                )}
                {visibility.showInvitations && (
                  <ShareInvitationsSection
                    invitations={invitations}
                    roles={props.invitationRoles!}
                    canUpdate={canUpdate}
                    onUpdateInvitation={handleUpdateInvitation}
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
                    onUpdateAccess={handleUpdateAccess}
                    onDeleteAccess={props.onDeleteAccess}
                    membersTitle={props.membersTitle}
                    renderAccessRightExtras={props.renderAccessRightExtras}
                    getAccessClassName={props.getAccessClassName}
                    renderAccessFooter={props.renderAccessFooter}
                    hasNextMembers={props.hasNextMembers}
                    onLoadNextMembers={props.onLoadNextMembers}
                    headerAction={
                      visibility.showMembersActions && (
                        <ShareMembersActions
                          onOpenImport={
                            visibility.allowImport
                              ? contactImport.open
                              : undefined
                          }
                          isRestricted={props.isRestricted}
                          onRequestAccessAction={
                            canChangeAccess ? setAccessAction : undefined
                          }
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
                linkExpiresAt={props.linkExpiresAt}
                onUpdateLinkExpiresAt={props.onUpdateLinkExpiresAt}
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
      {accessAction && props.canRestrict && accessActionHandler && (
        <ShareAccessConfirmationModal
          action={accessAction}
          onClose={() => setAccessAction(undefined)}
          onConfirm={accessActionHandler}
        />
      )}
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
