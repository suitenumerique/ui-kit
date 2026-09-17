import type { ReactNode } from "react";
import type {
  DropdownMenuOption,
  DropdownMenuProps,
} from ":/components/dropdown-menu";
import type { InvitationData, UserData, AccessData } from "../types";
import type { ShareImportRow } from "../import-modal/ShareImportModal";
import type { CustomTranslations } from ":/hooks/useCustomTranslations";

export type ShareModalInvitationProps<UserType, InvitationType> = {
  invitations?: InvitationData<UserType, InvitationType>[];
  onUpdateInvitation?: (
    invitation: InvitationData<UserType, InvitationType>,
    role: string,
  ) => void;
  onDeleteInvitation?: (
    invitation: InvitationData<UserType, InvitationType>,
  ) => void;
  hasNextInvitations?: boolean;
  onLoadNextInvitations?: () => void;
  invitationRoleTopMessage?: (
    invitation: InvitationData<UserType, InvitationType>,
  ) => string;
};

export type ShareModalAccessProps<UserType, AccessType> = {
  accesses?: AccessData<UserType, AccessType>[];
  accessRoleKey?: keyof AccessData<UserType, AccessType>; // The key of the role in the access data
  hasNextMembers?: boolean;
  onLoadNextMembers?: () => void;
  onDeleteAccess?: (access: AccessData<UserType, AccessType>) => void;
  onUpdateAccess?: (
    access: AccessData<UserType, AccessType>,
    role: string,
  ) => void;
  accessRoleTopMessage?: (
    access: AccessData<UserType, AccessType>,
  ) => string | ReactNode | undefined;
  /**
   * Rendered directly below each access row inside the members list. Lets
   * consumers attach extra content to an access (e.g. a per-access sub-list).
   */
  renderAccessFooter?: (access: AccessData<UserType, AccessType>) => ReactNode;
  /**
   * Rendered on the right side of each access row, inline with the role
   * dropdown. Lets consumers surface a per-access action (e.g. an "Assign" CTA).
   */
  renderAccessRightExtras?: (
    access: AccessData<UserType, AccessType>,
  ) => ReactNode;
  /**
   * Extra class name applied to each access row wrapper. Lets consumers flag
   * row-level state (e.g. assignment) so CSS can decorate the row.
   */
  getAccessClassName?: (
    access: AccessData<UserType, AccessType>,
  ) => string | undefined;
  /**
   * Overrides the default "N members" section heading (which otherwise comes
   * from `useCunningham()` translations).
   */
  membersTitle?: (members: AccessData<UserType, AccessType>[]) => ReactNode;
};

export type ShareModalSearchProps<UserType> = {
  searchUsersResult?: UserData<UserType>[];
  onSearchUsers?: (search: string) => void;
  searchPlaceholder?: string;
  onInviteUser?: (users: UserData<UserType>[], role: string) => void;
  loading?: boolean;
  /**
   * Overrides the heading rendered above the search results group (defaults to
   * Cunningham's `components.share.search.group_name`).
   */
  searchGroupName?: string;
  /**
   * When `false`, typing an email that does not match any search result will
   * NOT surface an "invite" action: only users returned by `onSearchUsers` can
   * be selected. Defaults to `true`.
   */
  allowInvitation?: boolean;
};

export type ShareModalLinkSettingsProps = {
  linkSettings?: boolean;
  linkReachChoices?: Partial<DropdownMenuOption>[];
  onUpdateLinkReach?: (value: string) => void;
  linkReach?: string;
  linkRoleChoices?: Partial<DropdownMenuOption>[];
  linkRole?: "reader" | "editor";
  showLinkRole?: boolean;
  onUpdateLinkRole?: (value: string) => void;
  topLinkReachMessage?: DropdownMenuProps["topMessage"];
  topLinkRoleMessage?: DropdownMenuProps["topMessage"];
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
  canView?: boolean;
  cannotViewChildren?: ReactNode;
  cannotViewMessage?: string;
  onClose: () => void;
  invitationRoles?: DropdownMenuOption[];
  getAccessRoles?: (
    access: AccessData<UserType, AccessType>,
  ) => DropdownMenuOption[];
  outsideSearchContent?: ReactNode;
  hideInvitations?: boolean;
  hideMembers?: boolean;
  allowFileImport?: boolean;
  maxImportRows?: number;
  onImportContacts?: (rows: ShareImportRow[]) => Promise<boolean> | boolean;
  onImportFileChange?: (file?: File) => void;
  isRestricted?: boolean;
  /**
   * Message displayed on the uploader when the import fails.
   */
  importErrorMessage?: string;
  importModalChildren?: ReactNode;
  customTranslations?: CustomTranslations;
} & ShareModalInvitationProps<UserType, InvitationType> &
  ShareModalAccessProps<UserType, AccessType> &
  ShareModalSearchProps<UserType> &
  ShareModalLinkSettingsProps;
