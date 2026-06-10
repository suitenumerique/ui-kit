import { Command } from "cmdk";
import { KeyboardEvent, useEffect, useState } from "react";
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
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const hasSelection = selectedUsers.length > 0;

  useEffect(() => {
    if (
      selectedUserId !== null &&
      !selectedUsers.some((user) => user.id === selectedUserId)
    ) {
      setSelectedUserId(null);
    }
  }, [selectedUserId, selectedUsers]);

  const handleInputChange = (value: string) => {
    if (value.length > 0 && selectedUserId !== null) {
      setSelectedUserId(null);
    }

    onInputChange(value);
  };

  const handleRemoveUser = (user: UserData<UserType>) => {
    if (selectedUserId === user.id) {
      setSelectedUserId(null);
    }

    onRemoveUser(user);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key !== "Backspace" ||
      inputValue.length > 0 ||
      selectedUsers.length === 0
    ) {
      if (selectedUserId !== null && event.key !== "Backspace") {
        setSelectedUserId(null);
      }

      return;
    }

    event.preventDefault();

    const selectedUser = selectedUsers.find((user) => user.id === selectedUserId);

    if (selectedUser) {
      handleRemoveUser(selectedUser);
      return;
    }

    setSelectedUserId(selectedUsers[selectedUsers.length - 1].id);
  };

  const leadingIcon = loading ? (
    <Spinner size="md" />
  ) : (
    <span className="material-icons">search</span>
  );

  return (
    <div className="c__share-modal__search-field" data-testid="share-search-field">
      <div className="c__share-modal__search-field__icon">{leadingIcon}</div>
      <div className="c__share-modal__search-field__content">
        {hasSelection &&
          selectedUsers.map((user) => (
            <InvitationUserSelectorItem
              key={user.id}
              user={user}
              isSelected={selectedUserId === user.id}
              onRemoveUser={handleRemoveUser}
            />
          ))}
        <div className="c__share-modal__search-field__main-space">
          <Command.Input
            autoFocus
            role="combobox"
            aria-label={t("components.share.user.placeholder")}
            className="c__share-modal__search-field__input"
            value={inputValue}
            placeholder={hasSelection ? undefined : placeholder}
            onKeyDown={handleInputKeyDown}
            onValueChange={handleInputChange}
          />
          {hasSelection && (
            <AccessRoleDropdown
              roles={roles}
              selectedRole={selectedRole}
              onSelect={onSelectRole}
              isOpen={isRoleOpen}
              onOpenChange={setIsRoleOpen}
              canDelete={false}
              onDelete={undefined}
            />
          )}
        </div>
      </div>
      {hasSelection && (
        <div className="c__share-modal__search-field__actions">
          <Button onClick={onShare} data-testid="share-invite-button">
            {shareButtonLabel ?? t("components.share.shareButton")}
          </Button>
        </div>
      )}
    </div>
  );
};
