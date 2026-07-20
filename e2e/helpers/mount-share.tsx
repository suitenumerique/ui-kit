import { useState } from "react";
import { CunninghamProvider } from "../../src/components/Provider/Provider";
import { ShareModal } from "../../src/components/share/modal/ShareModal";
import { UserData } from "../../src/components/share/types";

type SimpleUser = UserData<unknown>;

const USERS: SimpleUser[] = [
  { id: "u1", full_name: "Amandine Salambo", email: "amandine@example.com" },
  { id: "u2", full_name: "Jakob Philips", email: "jakob@example.com" },
  { id: "u3", full_name: "Kaylynn George", email: "kaylynn@example.com" },
  { id: "u4", full_name: "Beatrice Laurent", email: "beatrice@example.com" },
  { id: "u5", full_name: "Mohamed Benali", email: "mohamed@example.com" },
  { id: "u6", full_name: "Charlotte Dubois", email: "charlotte@example.com" },
  { id: "u7", full_name: "Alejandro Romero", email: "alejandro@example.com" },
  { id: "u8", full_name: "Sophie Moreau", email: "sophie@example.com" },
  {
    id: "u9",
    full_name: "Christopher Martin",
    email: "christopher@example.com",
  },
];

/**
 * Minimal stateful ShareModal for Playwright CT. Search always resolves to the
 * same users so selection is deterministic.
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
