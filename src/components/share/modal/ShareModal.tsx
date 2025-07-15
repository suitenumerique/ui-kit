import { DropdownMenuOption } from ":/components/dropdown-menu";
import { InvitationUserSelectorList } from "../users-invitation/InvitationUserSelectorList";
import {
  useState,
  useRef,
  useMemo,
  PropsWithChildren,
  ReactNode,
  useCallback,
} from "react";
import {
  Button,
  Modal,
  ModalSize,
  useCunningham,
} from "@openfun/cunningham-react";
import {
  QuickSearch,
  QuickSearchData,
  QuickSearchGroup,
} from ":/components/quick-search";
import { SearchUserItem } from "./items/SearchUserItem";
import {
  InvitationData,
  UserData,
  AccessData,
} from ":/components/share/types.ts";
import { ShareMemberItem } from "./items/ShareMemberItem";
import { ShareInvitationItem } from "./items/ShareInvitationItem";
import { useResponsive } from ":/hooks/useResponsive";
import { ShareLinkSettings } from "./items/ShareLinkSettings";

// We separate the props into two types to make them lighter. Here are only the invitation-specific props
type ShareModalInvitationProps<UserType, InvitationType> = {
  invitations?: InvitationData<UserType, InvitationType>[];
  onUpdateInvitation?: (
    invitation: InvitationData<UserType, InvitationType>,
    role: string
  ) => void;
  onDeleteInvitation?: (
    invitation: InvitationData<UserType, InvitationType>
  ) => void;
  hasNextInvitations?: boolean;
  onLoadNextInvitations?: () => void;
  invitationRoleTopMessage?: (
    invitation: InvitationData<UserType, InvitationType>
  ) => string;
};

// We separate the props into two types to make them lighter. Here are only the access-specific props
type ShareModalAccessProps<UserType, AccessType> = {
  accesses?: AccessData<UserType, AccessType>[];
  hasNextMembers?: boolean;
  onLoadNextMembers?: () => void;
  onDeleteAccess?: (access: AccessData<UserType, AccessType>) => void;
  onUpdateAccess?: (
    access: AccessData<UserType, AccessType>,
    role: string
  ) => void;
  accessRoleTopMessage?: (
    access: AccessData<UserType, AccessType>
  ) => string | undefined;
};

// We separate the props into two types to make them lighter. Here are only the search-specific props
type ShareModalSearchProps<UserType> = {
  searchUsersResult?: UserData<UserType>[];
  onSearchUsers?: (search: string) => void;
  searchPlaceholder?: string;
  onInviteUser?: (users: UserData<UserType>[], role: string) => void;
  loading?: boolean;
};

type ShareModalLinkSettingsProps = {
  linkSettings?: boolean;
  linkReachChoices?: Partial<DropdownMenuOption>[];
  onUpdateLinkReach?: (value: string) => void;
  linkReach?: string;
  linkRoleChoices?: Partial<DropdownMenuOption>[];
  linkRole?: "reader" | "editor";
  showLinkRole?: boolean;
  onUpdateLinkRole?: (value: string) => void;
};

/**
 * Only the props for the modal and generic props
 * The modal is generic and can be with all types as long as the types meet the minimum requirements
 * Like the modal, we can search users, list invitations and members and modify them, that's why we give the corresponding types
 */
export type ShareModalProps<UserType, InvitationType, AccessType> = {
  modalTitle?: string;
  isOpen: boolean;
  canUpdate?: boolean;
  onClose: () => void;
  invitationRoles?: DropdownMenuOption[];
  getAccessRoles?: (
    access: AccessData<UserType, AccessType>
  ) => DropdownMenuOption[];
  outsideSearchContent?: ReactNode;
  hideInvitations?: boolean;
  hideMembers?: boolean;
} & ShareModalInvitationProps<UserType, InvitationType> &
  ShareModalAccessProps<UserType, AccessType> &
  ShareModalSearchProps<UserType> &
  ShareModalLinkSettingsProps;

export const ShareModal = <UserType, InvitationType, AccessType>({
  searchUsersResult,
  children,
  outsideSearchContent,
  accesses: members = [],
  invitations = [],
  hasNextMembers = false,
  canUpdate = true,
  hasNextInvitations = false,
  hideInvitations = false,
  hideMembers = false,
  ...props
}: PropsWithChildren<
  ShareModalProps<UserType, InvitationType, AccessType>
>) => {
  // This is easier than using discriminated unions for readability.
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

  const { t } = useCunningham();
  const { isMobile } = useResponsive();
  const searchUserTimeoutRef = useRef<NodeJS.Timeout>(null);
  const [listHeight, setListHeight] = useState<string>("400px");
  const selectedUsersRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pendingInvitationUsers, setPendingInvitationUsers] = useState<
    UserData<UserType>[]
  >([]);
  const [selectedInvitationRole, setSelectedInvitationRole] = useState<string>(
    props.invitationRoles?.[0]?.value ?? ""
  );

  /**
   * The height of the modal content
   * 100dvh - 2em - 12px  is the max cunningham modal height.  690px is the height of the content in desktop ad 34px is the height of the modal title in mobile
   */
  const modalContentHeight = !isMobile
    ? "min(690px, calc(100dvh - 2em - 12px - 32px))"
    : `calc(100dvh - 32px)`;

  const onSearchUser = (search: string) => {
    if (searchUserTimeoutRef.current) {
      clearTimeout(searchUserTimeoutRef.current);
    }

    if (search === "") {
      setSearchQuery("");
      props.onSearchUsers!("");
      return;
    }

    searchUserTimeoutRef.current = setTimeout(() => {
      props.onSearchUsers!(search);
      setSearchQuery(search);
    }, 300);
  };

  const onInputChange = (str: string) => {
    setInputValue(str);
    onSearchUser(str);
  };

  const showSearchUsers =
    searchQuery !== "" || pendingInvitationUsers.length > 0;

  const onSelect = useCallback(
    (user: UserData<UserType>) => {
      setPendingInvitationUsers((prev) => [...prev, user]);
      setInputValue("");
      setSearchQuery("");
      props.onSearchUsers!("");
    },
    [props]
  );

  const onRemoveUser = (user: UserData<UserType>) => {
    setPendingInvitationUsers((prev) => prev.filter((u) => u.id !== user.id));
  };

  const usersData: QuickSearchData<UserData<UserType>> = useMemo(() => {
    const searchMemberResult = searchUsersResult?.filter(
      (user) => !pendingInvitationUsers.includes(user)
    );
    let emptyString: string | undefined =
      searchQuery !== ""
        ? t("components.share.user.no_result")
        : t("components.share.user.placeholder");

    const isValidEmail = (email: string) => {
      return !!email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z\-0-9]{2,}))$/
      );
    };

    /**
     * If we type an email address, and this email is not in the search results,
     * then we consider that we need to invite this person
     */
    const isInvitationMode =
      isValidEmail(searchQuery ?? "") &&
      !searchMemberResult?.some((user) => user.email === searchQuery);

    const newUser = {
      id: searchQuery,
      full_name: "",
      email: searchQuery,
    };

    /**
     * If the search query is an email, we don't display the empty string beacause
     * we display the user with this email row instead
     */
    if (isInvitationMode) {
      emptyString = undefined;
    }

    const group: QuickSearchData<UserData<UserType>> = {
      groupName: t("components.share.search.group_name"),
      elements: searchMemberResult ?? [],
      showWhenEmpty: true,
      emptyString,
      endActions: isInvitationMode
        ? [
            {
              content: <SearchUserItem user={newUser} />,
              onSelect: () => void onSelect(newUser as UserData<UserType>),
            },
          ]
        : undefined,
    };
    return group;
  }, [searchUsersResult, searchQuery, t, pendingInvitationUsers, onSelect]);

  /**
   * Set the height of the list of the quick search content.
   * Because the package sets the size automatically based on the content
   */
  const handleRef = (node: HTMLDivElement) => {
    const inputHeight = 70;
    const footerHeight = node?.clientHeight ?? 0;
    const selectedUsersHeight = selectedUsersRef.current?.clientHeight ?? 0;
    const height = `calc(${modalContentHeight} - ${footerHeight}px - ${selectedUsersHeight}px - ${inputHeight}px - 10px)`;
    setListHeight(height);
  };

  const showInvitations =
    !hideInvitations &&
    !showSearchUsers &&
    !props.loading &&
    invitations.length > 0;

  const showMembers =
    !hideMembers && !showSearchUsers && !props.loading && members.length > 0;

  // If we hide invitations and members, we don't show the search anyway.
  const showSearch = !(hideInvitations && hideMembers);

  return (
    <Modal
      title={props.modalTitle ?? t("components.share.modalTitle")}
      isOpen={props.isOpen}
      onClose={props.onClose}
      closeOnClickOutside
      size={isMobile ? ModalSize.FULL : ModalSize.LARGE}
    >
      <div className="c__share-modal no-padding">
        {canUpdate && pendingInvitationUsers.length > 0 && (
          <div
            className="c__share-modal__selected-users"
            ref={selectedUsersRef}
          >
            <InvitationUserSelectorList
              users={pendingInvitationUsers}
              onRemoveUser={onRemoveUser}
              roles={props.invitationRoles!}
              selectedRole={selectedInvitationRole}
              onSelectRole={setSelectedInvitationRole}
              onShare={() => {
                props.onInviteUser!(
                  pendingInvitationUsers,
                  selectedInvitationRole
                );
                setPendingInvitationUsers([]);
              }}
            />
          </div>
        )}

        {showSearch && (
          <QuickSearch
            onFilter={onInputChange}
            inputValue={inputValue}
            showInput={canUpdate}
            loading={props.loading}
            placeholder={t("components.share.user.placeholder")}
          >
            <div
              style={{
                height: listHeight,
                overflowY: "auto",
              }}
            >
              {showSearchUsers && (
                <div className="c__share-modal__search-users">
                  <QuickSearchGroup
                    group={usersData}
                    onSelect={(user) => {
                      onSelect(user);
                    }}
                    renderElement={(user) => <SearchUserItem user={user} />}
                  />
                </div>
              )}

              {!showSearchUsers && children}

              {/* Invitations list */}
              {showInvitations && (
                <div className="c__share-modal__invitations">
                  <span className="c__share-modal__invitations-title">
                    {t("components.share.invitations.title")}
                  </span>
                  {invitations.map((invitation) => (
                    <ShareInvitationItem
                      key={invitation.id}
                      invitation={invitation}
                      roles={props.invitationRoles!}
                      updateRole={props.onUpdateInvitation}
                      deleteInvitation={props.onDeleteInvitation}
                      canUpdate={canUpdate}
                      roleTopMessage={props.invitationRoleTopMessage?.(
                        invitation
                      )}
                    />
                  ))}
                  <ShowMoreButton
                    show={hasNextInvitations}
                    onShowMore={props.onLoadNextInvitations}
                  />
                </div>
              )}

              {/* Members list */}
              {showMembers && (
                <div className="c__share-modal__members">
                  <span className="c__share-modal__members-title">
                    {t(
                      members.length > 1
                        ? "components.share.members.title_plural"
                        : "components.share.members.title_singular",
                      {
                        count: members.length,
                      }
                    )}
                  </span>
                  {members.map((member) => (
                    <ShareMemberItem
                      key={member.id}
                      accessData={member}
                      canUpdate={canUpdate}
                      roleTopMessage={props.accessRoleTopMessage?.(member)}
                      roles={
                        props.getAccessRoles?.(member) ?? props.invitationRoles!
                      }
                      updateRole={props.onUpdateAccess}
                      deleteAccess={props.onDeleteAccess}
                    />
                  ))}
                  <ShowMoreButton
                    show={hasNextMembers}
                    onShowMore={props.onLoadNextMembers}
                  />
                </div>
              )}
            </div>
          </QuickSearch>
        )}

        <div ref={handleRef}>
          {!showSearchUsers && (
            <div className="c__share-modal__footer">
              {props.linkSettings && (
                <ShareLinkSettings
                  linkReachChoices={props.linkReachChoices}
                  canUpdate={canUpdate}
                  onUpdateLinkReach={props.onUpdateLinkReach!}
                  linkReach={props.linkReach}
                  linkRoleChoices={props.linkRoleChoices}
                  linkRole={props.linkRole}
                  onUpdateLinkRole={props.onUpdateLinkRole!}
                  showLinkRole={props.showLinkRole}
                />
              )}
              {outsideSearchContent}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

type ShowMoreButtonProps = {
  show: boolean;
  onShowMore?: () => void;
};

const ShowMoreButton = ({ show, onShowMore }: ShowMoreButtonProps) => {
  const { t } = useCunningham();
  if (!show) return null;
  return (
    <div className="c__share-modal__show-more-button">
      <Button
        color="primary-text"
        size="small"
        icon={<span className="material-icons">arrow_downward</span>}
        onClick={onShowMore}
      >
        {t("components.share.members.load_more")}
      </Button>
    </div>
  );
};
