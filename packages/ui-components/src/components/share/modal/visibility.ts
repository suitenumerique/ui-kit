/** Main content modes of the share modal. */
export enum ShareModalVisibilityMode {
  RESTRICTED = "restricted",
  SHARING = "sharing",
  FOOTER_ONLY = "footerOnly",
}

type ShareModalVisibilityOptions = {
  canView: boolean;
  canUpdate: boolean;
  hideMembers: boolean;
  hideInvitations: boolean;
  allowFileImport: boolean;
  canRestrict?: boolean;
  isSearching: boolean;
  loading?: boolean;
  membersCount: number;
  invitationsCount: number;
};

export const getShareModalVisibility = ({
  canView,
  canUpdate,
  hideMembers,
  hideInvitations,
  allowFileImport,
  canRestrict = false,
  isSearching,
  loading,
  membersCount,
  invitationsCount,
}: ShareModalVisibilityOptions) => {
  const mode = !canView
    ? ShareModalVisibilityMode.RESTRICTED
    : hideMembers && hideInvitations
      ? ShareModalVisibilityMode.FOOTER_ONLY
      : ShareModalVisibilityMode.SHARING;
  const showLists =
    mode === ShareModalVisibilityMode.SHARING && !isSearching && !loading;
  const allowImport = allowFileImport && canUpdate;
  const showMembersActions =
    showLists && !hideMembers && canUpdate && (allowImport || canRestrict);

  return {
    mode,
    allowImport,
    showMembersActions,
    // Actions remain reachable even when the members list is empty.
    showMembers:
      showLists && !hideMembers && (membersCount > 0 || showMembersActions),
    showInvitations: showLists && !hideInvitations && invitationsCount > 0,
    showFooter: !isSearching,
  };
};
