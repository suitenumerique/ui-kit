import { useEffect, useState } from "react";
import { Button } from "@gouvfr-lasuite/cunningham-react";
import { ShareModal } from "../ShareModal";

import { AccessData, UserData } from ":/components/share/types.ts";
import { DropdownMenuOption } from ":/components/dropdown-menu";

type UserType = UserData<object>;

type AccessType = AccessData<
  UserType,
  {
    name: string;
  }
>;

/**
 * Demonstrates the access-row extension slots:
 * - `renderAccessRightExtras`: an inline "Assign" CTA next to the role dropdown
 * - `getAccessClassName`: flags the assigned rows so CSS can decorate them
 * - `renderAccessFooter`: a note rendered directly below the assigned rows
 * - `membersTitle`: a custom members section heading
 * - `allowInvitation={false}`: only known users can be added, no invite-by-email
 */
export const ShareModalExtensionsExample = () => {
  const [userQuery, setUserQuery] = useState("");
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [assignedIds, setAssignedIds] = useState<Set<string>>(new Set());
  const [members, setMembers] = useState<AccessType[]>(() => {
    const ids = [1, 2, 3];
    return ids.map((id) => ({
      id: id.toString(),
      name: "John Doe " + id,
      email: "john.doe@example.com " + id,
      role: id === 1 ? "viewer" : "admin",
      user: {
        id: id.toString(),
        full_name: "John Doe " + id,
        email: "john.doe@example.com " + id,
      },
    }));
  });

  const invitationRoles = [
    { label: "Admin", value: "admin" },
    { label: "Editor", value: "editor" },
    { label: "Viewer", value: "viewer" },
  ];

  const getAccessRoles = (access: AccessType): DropdownMenuOption[] => {
    const isAdmin = access.role === "admin";
    return [
      { label: "Admin", value: "admin", isDisabled: false },
      { label: "Editor", value: "editor", isDisabled: isAdmin },
      { label: "Viewer", value: "viewer", isDisabled: isAdmin },
    ];
  };

  useEffect(() => {
    if (userQuery === "") {
      setUsers([]);
      return;
    }
    const id1 = Math.floor(Math.random() * 999) + 1;
    setLoading(true);
    const timeout = setTimeout(() => {
      setUsers([
        {
          id: id1.toString(),
          full_name: "Jane Doe " + id1,
          email: "jane.doe@example.com " + id1,
        },
      ]);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [userQuery]);

  const toggleAssign = (id: string) => {
    setAssignedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const onUpdateAccess = (access: AccessType, role: string) => {
    setMembers(
      members.map((member) =>
        member.id === access.id ? { ...member, role } : member
      )
    );
  };

  const onDeleteAccess = (access: AccessType) => {
    setMembers(members.filter((member) => member.id !== access.id));
  };

  return (
    <ShareModal
      isOpen={true}
      onClose={() => {}}
      accesses={members}
      onSearchUsers={setUserQuery}
      onInviteUser={console.log}
      onUpdateAccess={onUpdateAccess}
      onDeleteAccess={onDeleteAccess}
      loading={loading}
      invitationRoles={invitationRoles}
      searchUsersResult={users}
      getAccessRoles={getAccessRoles}
      hideInvitations
      // Only known users can be added — no invite-by-email action.
      allowInvitation={false}
      searchGroupName="Suggested users"
      membersTitle={(m) => `Team (${m.length})`}
      renderAccessRightExtras={(access) => (
        <Button
          size="small"
          variant={assignedIds.has(access.id) ? "tertiary" : "secondary"}
          color={assignedIds.has(access.id) ? "error" : undefined}
          onClick={() => toggleAssign(access.id)}
        >
          {assignedIds.has(access.id) ? "Unassign" : "Assign"}
        </Button>
      )}
      getAccessClassName={(access) =>
        assignedIds.has(access.id) ? "c__share-member-item--assigned" : undefined
      }
      renderAccessFooter={(access) =>
        assignedIds.has(access.id) ? (
          <div style={{ padding: "0 var(--c--globals--spacings--base) 8px 56px" }}>
            <small>Assigned to this resource</small>
          </div>
        ) : null
      }
    />
  );
};
