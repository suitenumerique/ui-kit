import { Fragment, type ReactNode } from "react";
import type { DropdownMenuOption } from ":/components/dropdown-menu";
import { useCunningham } from ":/components/provider";
import type { AccessData } from "../types";
import { ShareMemberItem } from "./items/ShareMemberItem";
import { ShowMoreButton } from "./ShowMoreButton";
import type { ShareModalAccessProps } from "./types";

type ShareMembersSectionProps<UserType, AccessType> = ShareModalAccessProps<
  UserType,
  AccessType
> & {
  roles: DropdownMenuOption[];
  canUpdate: boolean;
  getAccessRoles?: (
    access: AccessData<UserType, AccessType>,
  ) => DropdownMenuOption[];
  headerAction?: ReactNode;
};

/** Lists members with role actions, consumer extensions, and pagination. */
export const ShareMembersSection = <UserType, AccessType>({
  accesses: members = [],
  roles,
  canUpdate,
  getAccessRoles,
  headerAction,
  membersTitle,
  accessRoleKey,
  accessRoleTopMessage,
  onUpdateAccess,
  onDeleteAccess,
  renderAccessRightExtras,
  getAccessClassName,
  renderAccessFooter,
  hasNextMembers = false,
  onLoadNextMembers,
}: ShareMembersSectionProps<UserType, AccessType>) => {
  const { t } = useCunningham();
  return (
    <div className="c__share-modal__members" data-testid="members-list">
      <div className="c__share-modal__members-title">
        <span>
          {membersTitle
            ? membersTitle(members)
            : members.length > 0 &&
              t(
                members.length > 1
                  ? "components.share.members.title_plural"
                  : "components.share.members.title_singular",
                {
                  count: members.length,
                },
              )}
        </span>
        {headerAction}
      </div>
      {members.map((member) => (
        <Fragment key={member.id}>
          <ShareMemberItem
            accessData={member}
            accessRoleKey={accessRoleKey ?? "role"}
            canUpdate={canUpdate}
            roleTopMessage={accessRoleTopMessage?.(member)}
            roles={getAccessRoles?.(member) ?? roles}
            updateRole={onUpdateAccess}
            deleteAccess={onDeleteAccess}
            rightExtras={renderAccessRightExtras?.(member)}
            wrapperClassName={getAccessClassName?.(member)}
          />
          {renderAccessFooter?.(member)}
        </Fragment>
      ))}
      <ShowMoreButton show={hasNextMembers} onShowMore={onLoadNextMembers} />
    </div>
  );
};
