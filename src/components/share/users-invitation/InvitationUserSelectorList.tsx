import { Button, useCunningham } from "@gouvfr-lasuite/cunningham-react";
import { ReactNode, useState } from "react";
import { DropdownMenuOption } from "../../dropdown-menu";
import { AccessRoleDropdown } from "../access/AccessRoleDropdown";
import { UserData } from ":/components/share/types.ts";

export type AddShareUserListProps<UserType> = {
  users: UserData<UserType>[];
  onRemoveUser: (user: UserData<UserType>) => void;
  rightActions?: ReactNode;
  onShare: () => void;
  roles: DropdownMenuOption[];
  selectedRole: string;
  shareButtonLabel?: string;
  onSelectRole: (role: string) => void;
};

export const InvitationUserSelectorList = <UserType,>({
  users,
  onRemoveUser,
  rightActions,
  onShare,
  shareButtonLabel,
  roles,
  selectedRole,
  onSelectRole,
}: AddShareUserListProps<UserType>) => {
  const { t } = useCunningham();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="c__add-share-user-list">
      <div className="c__add-share-user-list__items">
        {users.map((user) => (
          <InvitationUserSelectorItem
            key={user.id}
            user={user}
            onRemoveUser={onRemoveUser}
          />
        ))}
      </div>
      <div className="c__add-share-user-list__right-actions">
        {rightActions}
        <AccessRoleDropdown
          roles={roles}
          selectedRole={selectedRole}
          onSelect={onSelectRole}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        />
        <Button onClick={onShare}>
          {shareButtonLabel ?? t("components.share.shareButton")}
        </Button>
      </div>
    </div>
  );
};

export type ShareSelectedUserItemProps<UserType> = {
  user: UserData<UserType>;
  onRemoveUser: (user: UserData<UserType>) => void;
};

export const InvitationUserSelectorItem = <UserType,>({
  user,
  onRemoveUser,
}: ShareSelectedUserItemProps<UserType>) => {
  return (
    <div className="c__add-share-user-item">
      <span>{user.full_name || user.email}</span>
      <Button
        variant="tertiary"
        color="neutral"
        size="nano"
        onClick={() => onRemoveUser?.(user)}
        icon={<span className="material-icons">close</span>}
      />
    </div>
  );
};
