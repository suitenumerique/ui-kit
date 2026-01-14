import {
  DropdownMenu,
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
};

export const AccessRoleDropdown = ({
  roles,
  onSelect,
  canUpdate = true,
  selectedRole,
  isOpen,
  onOpenChange,
  roleTopMessage,
}: AccessRoleDropdownProps) => {
  const currentRoleString = roles.find((role) => role.value === selectedRole);

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
          ".c__access-role-dropdown"
        );
        // If the element is not a child of the access role dropdown, close the dropdown
        if (isAccessRoleDropdown) {
          return false;
        }
        return true;
      }}
      onOpenChange={onOpenChange}
      options={roles}
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
