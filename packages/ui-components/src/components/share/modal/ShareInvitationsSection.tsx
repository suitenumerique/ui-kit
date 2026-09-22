import type { DropdownMenuOption } from ":/components/dropdown-menu";
import { useCunningham } from ":/components/provider";
import { ShareInvitationItem } from "./items/ShareInvitationItem";
import { ShowMoreButton } from "./ShowMoreButton";
import type { ShareModalInvitationProps } from "./types";

type ShareInvitationsSectionProps<UserType, InvitationType> =
  ShareModalInvitationProps<UserType, InvitationType> & {
    roles: DropdownMenuOption[];
    canUpdate: boolean;
  };

/** Lists pending invitations with role actions and pagination. */
export const ShareInvitationsSection = <UserType, InvitationType>({
  invitations = [],
  roles,
  canUpdate,
  onUpdateInvitation,
  onDeleteInvitation,
  invitationRoleTopMessage,
  hasNextInvitations = false,
  onLoadNextInvitations,
}: ShareInvitationsSectionProps<UserType, InvitationType>) => {
  const { t } = useCunningham();
  return (
    <div className="c__share-modal__invitations" data-testid="invitations-list">
      <span className="c__share-modal__invitations-title">
        {t("components.share.invitations.title")}
      </span>
      {invitations.map((invitation) => (
        <ShareInvitationItem
          key={invitation.id}
          invitation={invitation}
          roles={roles}
          updateRole={onUpdateInvitation}
          deleteInvitation={onDeleteInvitation}
          canUpdate={canUpdate}
          roleTopMessage={invitationRoleTopMessage?.(invitation)}
        />
      ))}
      <ShowMoreButton
        show={hasNextInvitations}
        onShowMore={onLoadNextInvitations}
      />
    </div>
  );
};
