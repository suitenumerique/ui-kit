import { Command } from "cmdk";
import { useState } from "react";
import { Button, useCunningham } from "@gouvfr-lasuite/cunningham-react";
import { Spinner } from ":/components/loader/Spinner";
import { DropdownMenuOption } from ":/components/dropdown-menu";
import { UserData } from ":/components/share/types.ts";
import { AccessRoleDropdown } from "../access/AccessRoleDropdown";
import { InvitationUserSelectorItem } from "../users-invitation/InvitationUserSelectorList";

export type ShareSearchFieldProps<UserType> = {
  /** Users pending invitation, displayed as removable chips. */
  selectedUsers: UserData<UserType>[];
  onRemoveUser: (user: UserData<UserType>) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  roles: DropdownMenuOption[];
  selectedRole: string;
  onSelectRole: (role: string) => void;
  onShare: () => void;
  shareButtonLabel?: string;
};

/**
 * Unified search field for the share modal: the selected-user chips live in the
 * same container as the search input (no separate gray frame), and the role
 * selector + invite button appear once at least one user is selected.
 */
export const ShareSearchField = <UserType,>({
  selectedUsers,
  onRemoveUser,
  inputValue,
  onInputChange,
  placeholder,
  loading,
  roles,
  selectedRole,
  onSelectRole,
  onShare,
  shareButtonLabel,
}: ShareSearchFieldProps<UserType>) => {
  const { t } = useCunningham();
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const hasSelection = selectedUsers.length > 0;

  const leadingIcon = loading ? (
    <Spinner size="md" />
  ) : (
    <span className="material-icons">search</span>
  );

  return (
    <div className="c__share-modal__search-field" data-testid="share-search-field">
      {hasSelection && (
        <div className="c__share-modal__search-field__chips">
          {leadingIcon}
          {selectedUsers.map((user) => (
            <InvitationUserSelectorItem
              key={user.id}
              user={user}
              onRemoveUser={onRemoveUser}
            />
          ))}
        </div>
      )}
      <div className="c__share-modal__search-field__bottom">
        {!hasSelection && leadingIcon}
        <Command.Input
          autoFocus
          role="combobox"
          aria-label={t("components.share.user.placeholder")}
          className="c__share-modal__search-field__input"
          value={inputValue}
          placeholder={placeholder}
          onValueChange={onInputChange}
        />
        {hasSelection && (
          <div className="c__share-modal__search-field__actions">
            <AccessRoleDropdown
              roles={roles}
              selectedRole={selectedRole}
              onSelect={onSelectRole}
              isOpen={isRoleOpen}
              onOpenChange={setIsRoleOpen}
              canDelete={false}
              onDelete={undefined}
            />
            <Button onClick={onShare} data-testid="share-invite-button">
              {shareButtonLabel ?? t("components.share.shareButton")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
