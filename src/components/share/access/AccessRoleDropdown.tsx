import { DropdownMenu, DropdownMenuOption } from ":/components/dropdown-menu";

type AccessRoleDropdownProps = {
  selectedRole: string;
  roles: DropdownMenuOption[];
  onSelect: (role: string) => void;
  canUpdate?: boolean;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  roleTopMessage?: string;
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
      <span className="fs-s clr-greyscale-600">{currentRoleString?.label}</span>
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
        onClick={() => {
          onOpenChange?.(!isOpen);
        }}
      >
        <span className="fs-s clr-greyscale-600">
          {currentRoleString?.label}
        </span>
        <span className="material-icons">
          {isOpen ? "arrow_drop_up" : "arrow_drop_down"}
        </span>
      </div>
    </DropdownMenu>
  );
};
