import { QuickSearchItemTemplate } from ":/components/quick-search";
import { InvitationData } from "../../types";
import { UserRow } from ":/components/users/rows/UserRow";
import { Button, useCunningham } from "@gouvfr-lasuite/cunningham-react";
import {
  DropdownMenu,
  DropdownMenuOption,
  useDropdownMenu,
} from ":/components/dropdown-menu";
import { AccessRoleDropdown } from "../../access/AccessRoleDropdown";

export type ShareInvitationItemProps<UserType, InvitationType> = {
  invitation: InvitationData<UserType, InvitationType>;
  roles: DropdownMenuOption[];
  updateRole?: (
    invitation: InvitationData<UserType, InvitationType>,
    role: string
  ) => void;
  deleteInvitation?: (
    invitation: InvitationData<UserType, InvitationType>
  ) => void;
  canUpdate?: boolean;
  roleTopMessage?: string;
  showMoreActionsButton?: boolean;
};

export const ShareInvitationItem = <UserType, InvitationType>({
  invitation,
  roles,
  updateRole,
  deleteInvitation,
  canUpdate = true,
  showMoreActionsButton = true,
  roleTopMessage,
}: ShareInvitationItemProps<UserType, InvitationType>) => {
  const { t } = useCunningham();
  const roleDropdown = useDropdownMenu();
  const menuOptions = useDropdownMenu();
  const options: DropdownMenuOption[] = [
    {
      label: t("components.share.access.delete"),
      callback: () => deleteInvitation?.(invitation),
      isDisabled: !canUpdate,
      icon: <span className="material-icons">back_hand</span>,
    },
  ];

  const handleOpenMenu = () => {
    const isOpen = menuOptions.isOpen;
    menuOptions.setIsOpen(!isOpen);
  };

  return (
    <div className="c__share-member-item">
      <QuickSearchItemTemplate
        testId="share-invitation-item"
        left={<UserRow fullName="" email={invitation.email} showEmail={true} />}
        alwaysShowRight={true}
        right={
          <div className="c__share-member-item__right">
            <AccessRoleDropdown
              roles={roles}
              selectedRole={invitation.role}
              onSelect={(role) => updateRole?.(invitation, role)}
              isOpen={roleDropdown.isOpen}
              canUpdate={canUpdate}
              onOpenChange={roleDropdown.setIsOpen}
              roleTopMessage={roleTopMessage}
            />
            {showMoreActionsButton && canUpdate && (
              <DropdownMenu
                options={options}
                isOpen={menuOptions.isOpen}
                onOpenChange={menuOptions.setIsOpen}
              >
                <Button
                  color="neutral"
                  variant="tertiary"
                  onClick={handleOpenMenu}
                  size="small"
                  icon={<span className="material-icons toto">more_horiz</span>}
                />
              </DropdownMenu>
            )}
          </div>
        }
      />
    </div>
  );
};
