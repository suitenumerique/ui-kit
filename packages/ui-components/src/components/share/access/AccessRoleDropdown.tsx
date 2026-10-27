import { Button } from ":/cunningham";
import { useCunningham } from ":/components/provider";
import { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuOption,
  DropdownMenuProps,
} from ":/components/dropdown-menu";
import { ChevronDown, ChevronUp } from ":/icons";
import { IconSize } from ":/components/icon";

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
  // The open state drives the chevron: tracked here when the parent does not
  // control it.
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isMenuOpen = isOpen ?? internalIsOpen;
  const handleOpenChange = (nextIsOpen: boolean) => {
    setInternalIsOpen(nextIsOpen);
    onOpenChange?.(nextIsOpen);
  };

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
      isOpen={isMenuOpen}
      onOpenChange={handleOpenChange}
      options={options}
      selectedValues={[selectedRole]}
      onSelectValue={onSelect}
      topMessage={roleTopMessage}
    >
      <Button
        className="c__access-role-dropdown"
        data-testid="access-role-dropdown-button"
        size="nano"
        color="neutral"
        variant="tertiary"
        icon={
          isMenuOpen ? (
            <ChevronUp size={IconSize.SMALL} />
          ) : (
            <ChevronDown size={IconSize.SMALL} />
          )
        }
        iconPosition="right"
      >
        {currentRoleString?.label}
      </Button>
    </DropdownMenu>
  );
};
