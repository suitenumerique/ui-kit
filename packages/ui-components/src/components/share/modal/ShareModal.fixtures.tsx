import { useState } from "react";
import { screen } from "@testing-library/react";
import { CunninghamProvider } from ":/components/provider";
import type { AccessData, InvitationData, UserData } from "../types";
import { ShareModalCopyLinkFooter } from "../utils/ShareModalCopyLinkFooter";
import { ShareModal, type ShareModalProps } from "./ShareModal";

export type Extra = object;
export type User = UserData<Extra>;
export type Member = AccessData<Extra, Extra>;
export type Invitation = InvitationData<Extra, Extra>;

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
