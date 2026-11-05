import { useState } from "react";
import { screen } from "@testing-library/react";
import { CunninghamProvider } from ":/components/provider";
import type {
  AccessData,
  AccessRequestData,
  InvitationData,
  UserData,
} from "../types";
import { ShareModalCopyLinkFooter } from "../utils/ShareModalCopyLinkFooter";
import { ShareModal, type ShareModalProps } from "./ShareModal";

export type Extra = object;
export type User = UserData<Extra>;
export type Member = AccessData<Extra, Extra>;
export type Invitation = InvitationData<Extra, Extra>;
export type AccessRequest = AccessRequestData<Extra, Extra>;

export const alice: User = {
  id: "user-alice",
  full_name: "Alice Martin",
  email: "alice@example.com",
};

export const member: Member = { id: "access-alice", role: "reader", user: alice };

export const invitation: Invitation = {
  id: "invitation-1",
  email: "invite@example.com",
  role: "editor",
  user: { id: "user-invite", full_name: "", email: "invite@example.com" },
};

export const germain: AccessRequest = {
  id: "request-germain",
  role: "reader",
  user: {
    id: "user-germain",
    full_name: "Germain Dupond",
    email: "germain@example.com",
  },
};

export const hugo: AccessRequest = {
  id: "request-hugo",
  role: "reader",
  user: { id: "user-hugo", full_name: "Hugo Martin", email: "hugo@example.com" },
};

export const roles = [
  { label: "Reader", value: "reader" },
  { label: "Editor", value: "editor" },
];

export const searchInput = () =>
  screen.getByRole("combobox", { name: "Search for a user to invite" });

export const Harness = (props: Partial<ShareModalProps<Extra, Extra, Extra>>) => {
  const [results, setResults] = useState<User[]>([]);

  return (
    <CunninghamProvider>
      <ShareModal<Extra, Extra, Extra>
        isOpen
        onClose={() => undefined}
        invitationRoles={roles}
        accesses={[member]}
        invitations={[invitation]}
        hasNextMembers
        hasNextInvitations
        searchUsersResult={results}
        onSearchUsers={(query) => setResults(query ? [alice] : [])}
        onInviteUser={() => undefined}
        linkSettings
        linkReach="restricted"
        linkReachChoices={[{ value: "restricted" }, { value: "public" }]}
        onUpdateLinkReach={() => undefined}
        onUpdateLinkRole={() => undefined}
        outsideSearchContent={
          <ShareModalCopyLinkFooter onCopyLink={() => undefined} onOk={() => undefined} />
        }
        {...props}
      />
    </CunninghamProvider>
  );
};

export const RequestsHarness = ({
  requests,
  canAccept = true,
  canReject = true,
}: {
  requests: AccessRequest[];
  canAccept?: boolean;
  canReject?: boolean;
}) => {
  const [pending, setPending] = useState(requests);
  const remove = (request: AccessRequest) =>
    setPending((current) => current.filter((item) => item.id !== request.id));

  return (
    <Harness
      accessRequests={pending}
      onAcceptAccessRequest={canAccept ? remove : undefined}
      onRejectAccessRequest={canReject ? remove : undefined}
    />
  );
};
