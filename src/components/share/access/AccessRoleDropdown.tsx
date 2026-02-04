import { useCunningham } from "@gouvfr-lasuite/cunningham-react";
import { useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuOption,
  DropdownMenuProps,
} from ":/components/dropdown-menu";

type AccessRoleDropdownProps = {
  selectedRole: string;
  roles: DropdownMenuOption[];
  onSelect: (role: string) => void;
  canUpdate?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  roleTopMessage?: DropdownMenuProps["topMessage"];
  onDelete?: () => void;
  canDelete?: boolean;
};

export const AccessRoleDropdown = ({
  roles,
  onSelect,
  canUpdate = true,
  selectedRole,
  isOpen,
  onOpenChange,
  roleTopMessage,
  onDelete,
  canDelete = true,
}: AccessRoleDropdownProps) => {
  const { t } = useCunningham();

  const currentRoleString = roles.find((role) => role.value === selectedRole);

  const options: DropdownMenuItem[] = useMemo(() => {
    if (!onDelete && !canDelete) {
      return roles;
    }

    return [
      ...roles,
      { type: "separator" as const },
      {
        label: t("components.share.access.delete"),
        callback: onDelete,
        isDisabled: !canDelete,
      },
    ];
  }, [roles, onDelete, t, canDelete]);

  if (!canUpdate) {
    return (
      <span className="c__access-role-dropdown__role-label-can-not-update">
        {currentRoleString?.label}
      </span>
    );
  }
  return (
    <DropdownMenu
      isOpen={isOpen}
      shouldCloseOnInteractOutside={(element) => {
        const isAccessRoleDropdown = element.closest(
          ".c__access-role-dropdown",
        );
        // If the element is not a child of the access role dropdown, close the dropdown
        if (isAccessRoleDropdown) {
          return false;
        }
        return true;
      }}
      onOpenChange={onOpenChange}
      options={options}
      selectedValues={[selectedRole]}
      onSelectValue={onSelect}
      topMessage={roleTopMessage}
    >
      <div
        role="button"
        className="c__access-role-dropdown"
        data-testid="access-role-dropdown-button"
        onClick={() => {
          onOpenChange?.(!isOpen);
        }}
      >
        <span className="c__access-role-dropdown__role-label">
          {currentRoleString?.label}
        </span>
        <span className="material-icons c__access-role-dropdown__icon">
          {isOpen ? "arrow_drop_up" : "arrow_drop_down"}
        </span>
      </div>
    </DropdownMenu>
  );
};
