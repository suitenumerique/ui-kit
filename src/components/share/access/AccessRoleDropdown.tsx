import { Button, useCunningham } from "@gouvfr-lasuite/cunningham-react";
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
      <Button
        className="c__access-role-dropdown"
        data-testid="access-role-dropdown-button"
        size="small"
        color="brand"
        variant="tertiary"
        icon={
          <span className="material-icons">
            {isOpen ? "arrow_drop_up" : "arrow_drop_down"}
          </span>
        }
        iconPosition="right"
        onClick={() => {
          onOpenChange?.(!isOpen);
        }}
      >
        {currentRoleString?.label}
      </Button>
    </DropdownMenu>
  );
};
