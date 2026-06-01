import { useState } from "react";
import { CunninghamProvider } from "../../src/components/Provider/Provider";
import { ShareModal } from "../../src/components/share/modal/ShareModal";
import { UserData } from "../../src/components/share/types";

type SimpleUser = UserData<unknown>;

const USERS: SimpleUser[] = [
  { id: "u1", full_name: "Amandine Salambo", email: "amandine@example.com" },
  { id: "u2", full_name: "Jakob Philips", email: "jakob@example.com" },
];

/**
 * Minimal stateful ShareModal for Playwright CT. Search always resolves to the
 * same two users so selection is deterministic.
 */
export const TestShareModal = () => {
  const [, setSearch] = useState("");
  return (
    <CunninghamProvider currentLocale="en-US">
      <ShareModal
        isOpen
        onClose={() => undefined}
        invitationRoles={[
          { label: "Admin", value: "admin" },
          { label: "Editor", value: "editor" },
        ]}
        onSearchUsers={setSearch}
        onInviteUser={() => undefined}
        searchUsersResult={USERS}
        accesses={[]}
        invitations={[]}
      />
    </CunninghamProvider>
  );
};
