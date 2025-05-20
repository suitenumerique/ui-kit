import { QuickSearchItemTemplate } from ":/components/quick-search";
import { AccessData } from "../../types";
import { UserRow } from ":/components/users/rows/UserRow";
import { Button, useCunningham } from "@openfun/cunningham-react";
import {
  DropdownMenu,
  DropdownMenuOption,
  useDropdownMenu,
} from ":/components/dropdown-menu";
import { AccessRoleDropdown } from "../../access/AccessRoleDropdown";
import { useMemo } from "react";

export type ShareMemberItemProps<UserType, AccessType> = {
  accessData: AccessData<UserType, AccessType>;
  roles: DropdownMenuOption[];
  updateRole?: (access: AccessData<UserType, AccessType>, role: string) => void;
  deleteAccess?: (access: AccessData<UserType, AccessType>) => void;
  canUpdate?: boolean;
  roleTopMessage?: string;
};

export const ShareMemberItem = <UserType, AccessType>({
  accessData,
  roles,
  updateRole,
  deleteAccess,
  canUpdate = true,
  roleTopMessage,
}: ShareMemberItemProps<UserType, AccessType>) => {
  const { t } = useCunningham();
  const roleDropdown = useDropdownMenu();

  const menuOptions = useDropdownMenu();
  const options: DropdownMenuOption[] = useMemo(() => {
    const options: DropdownMenuOption[] = [];
    if (deleteAccess) {
      options.push({
        label: t("components.share.access.delete"),
        icon: <span className="material-icons">back_hand</span>,
        isDisabled: !canUpdate,
        callback: () => deleteAccess(accessData),
      });
    }
    return options;
  }, [deleteAccess, accessData, canUpdate, t]);

  const handleOpenMenu = () => {
    const isOpen = menuOptions.isOpen;
    menuOptions.setIsOpen(!isOpen);
  };

  return (
    <div className="c__share-member-item">
      <QuickSearchItemTemplate
        left={
          <UserRow
            fullName={accessData.user.full_name}
            email={accessData.user.email}
            showEmail
          />
        }
        alwaysShowRight={true}
        right={
          <div className="c__share-member-item__right">
            <AccessRoleDropdown
              roles={roles}
              selectedRole={accessData.role}
              onSelect={(role) => updateRole?.(accessData, role)}
              isOpen={roleDropdown.isOpen}
              onOpenChange={roleDropdown.setIsOpen}
              canUpdate={canUpdate}
              roleTopMessage={roleTopMessage}
            />
            {options.length > 0 && canUpdate && (
              <DropdownMenu
                options={options}
                isOpen={menuOptions.isOpen}
                onOpenChange={menuOptions.setIsOpen}
              >
                <Button
                  color="primary-text"
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
