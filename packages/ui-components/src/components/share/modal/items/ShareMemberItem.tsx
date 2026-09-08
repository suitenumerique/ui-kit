import { ReactNode } from "react";
import clsx from "clsx";
import { QuickSearchItemTemplate } from ":/components/quick-search";
import { AccessData } from "../../types";
import { UserRow } from ":/components/users/rows/UserRow";
import {
  DropdownMenuOption,
  DropdownMenuProps,
  useDropdownMenu,
} from ":/components/dropdown-menu";
import { AccessRoleDropdown } from "../../access/AccessRoleDropdown";

export type ShareMemberItemProps<UserType, AccessType> = {
  accessData: AccessData<UserType, AccessType>;
  roles: DropdownMenuOption[];
  updateRole?: (access: AccessData<UserType, AccessType>, role: string) => void;
  deleteAccess?: (access: AccessData<UserType, AccessType>) => void;
  canUpdate?: boolean;
  roleTopMessage?: DropdownMenuProps["topMessage"];
  accessRoleKey?: keyof AccessData<UserType, AccessType>; // The key of the role in the access data, default to "role"
  /**
   * Rendered on the right side of the row, inline before the role dropdown.
   * Lets consumers surface a per-access action (e.g. an "Assign" CTA).
   */
  rightExtras?: ReactNode;
  /**
   * Optional extra class on the row wrapper. Lets consumers flag row-level
   * state (e.g. assignment) that this component does not know about — CSS can
   * then hook into it to decorate the row or its avatar.
   */
  wrapperClassName?: string;
};

export const ShareMemberItem = <UserType, AccessType>({
  accessData,
  accessRoleKey = "role",
  roles,
  updateRole,
  deleteAccess,
  canUpdate = true,
  roleTopMessage,
  rightExtras,
  wrapperClassName,
}: ShareMemberItemProps<UserType, AccessType>) => {
  const roleDropdown = useDropdownMenu();
  const canDelete =
    accessData.is_explicit !== false && accessData.can_delete !== false;
  return (
    <div className={clsx("c__share-member-item", wrapperClassName)}>
      <QuickSearchItemTemplate
        testId="share-member-item"
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
            {rightExtras}
            <AccessRoleDropdown
              roles={roles}
              selectedRole={accessData[accessRoleKey] as string}
              onSelect={(role) => updateRole?.(accessData, role)}
              isOpen={roleDropdown.isOpen}
              onOpenChange={roleDropdown.setIsOpen}
              canUpdate={canUpdate}
              roleTopMessage={roleTopMessage}
              canDelete={canDelete}
              onDelete={
                deleteAccess ? () => deleteAccess(accessData) : undefined
              }
            />
          </div>
        }
      />
    </div>
  );
};
