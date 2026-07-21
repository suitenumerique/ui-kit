import { QuickSearchItemTemplate } from ":/components/quick-search";
import { InvitationData } from "../../types";
import { UserRow } from ":/components/users/rows/UserRow";
import { DropdownMenuOption, useDropdownMenu } from ":/components/dropdown-menu";
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
};

export const ShareInvitationItem = <UserType, InvitationType>({
  invitation,
  roles,
  updateRole,
  deleteInvitation,
  canUpdate = true,
  roleTopMessage,
}: ShareInvitationItemProps<UserType, InvitationType>) => {
  const roleDropdown = useDropdownMenu();

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
              onDelete={
                deleteInvitation
                  ? () => deleteInvitation(invitation)
                  : undefined
              }
            />
          </div>
        }
      />
    </div>
  );
};
