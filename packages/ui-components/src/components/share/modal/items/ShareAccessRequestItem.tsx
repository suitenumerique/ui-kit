import { useState } from "react";
import { Button } from ":/cunningham";
import { QuickSearchItemTemplate } from ":/components/quick-search";
import { UserRow } from ":/components/users/rows/UserRow";
import {
  DropdownMenuOption,
  useDropdownMenu,
} from ":/components/dropdown-menu";
import { useCunningham } from ":/components/provider";
import { IconSize } from ":/components/icon";
import { Checkmark2, XMark } from ":/icons";
import { AccessRoleDropdown } from "../../access/AccessRoleDropdown";
import { getRoleLabel, getUserDisplayName } from "../../labels";
import type { AccessRequestData } from "../../types";
import { ACCESS_REQUEST_ACTION_CLASS } from "../useAccessRequestFocus";

export type ShareAccessRequestItemProps<UserType, AccessRequestType> = {
  request: AccessRequestData<UserType, AccessRequestType>;
  roles: DropdownMenuOption[];
  canAccept: boolean;
  canReject: boolean;
  onAccept: (
    request: AccessRequestData<UserType, AccessRequestType>,
    role: string,
  ) => void;
  onReject: (request: AccessRequestData<UserType, AccessRequestType>) => void;
};

/** One access request, with the role to grant chosen on the row. */
export const ShareAccessRequestItem = <UserType, AccessRequestType>({
  request,
  roles,
  canAccept,
  canReject,
  onAccept,
  onReject,
}: ShareAccessRequestItemProps<UserType, AccessRequestType>) => {
  const roleDropdown = useDropdownMenu();
  const { t } = useCunningham();
  const [role, setRole] = useState(request.role);
  const [requestedRole, setRequestedRole] = useState(request.role);
  if (request.role !== requestedRole) {
    setRequestedRole(request.role);
    setRole(request.role);
  }
  const name = getUserDisplayName(request.user);
  const roleLabel = getRoleLabel(roles, role) ?? "";

  return (
    <div className="c__share-member-item">
      <QuickSearchItemTemplate
        testId="share-access-request-item"
        left={
          <UserRow
            fullName={request.user.full_name}
            email={request.user.email}
            showEmail
          />
        }
        alwaysShowRight={true}
        right={
          <div className="c__share-member-item__right">
            <AccessRoleDropdown
              roles={roles}
              selectedRole={role}
              onSelect={setRole}
              isOpen={roleDropdown.isOpen}
              onOpenChange={roleDropdown.setIsOpen}
              canDelete={false}
              aria-label={t("components.share.access_requests.role_label", {
                name,
                role: roleLabel,
              })}
            />
            {canAccept && (
              <Button
                variant="secondary"
                color="brand"
                size="nano"
                className={ACCESS_REQUEST_ACTION_CLASS}
                icon={<Checkmark2 size={IconSize.SMALL} aria-hidden="true" />}
                aria-label={t("components.share.access_requests.accept", {
                  name,
                })}
                onClick={() => onAccept(request, role)}
              />
            )}
            {canReject && (
              <Button
                variant="tertiary"
                color="neutral"
                size="nano"
                className={canAccept ? undefined : ACCESS_REQUEST_ACTION_CLASS}
                icon={<XMark size={IconSize.SMALL} aria-hidden="true" />}
                aria-label={t("components.share.access_requests.reject", {
                  name,
                })}
                onClick={() => onReject(request)}
              />
            )}
          </div>
        }
      />
    </div>
  );
};
