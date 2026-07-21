import { useEffect, useState } from "react";
import { ShareModal } from "../ShareModal";

import {
  AccessData,
  InvitationData,
  UserData,
} from ":/components/share/types.ts";
import { ShareModalCopyLinkFooter } from "../../utils/ShareModalCopyLinkFooter";
import { DropdownMenuOption } from ":/components/dropdown-menu";
import { ShareImportRow } from "../../import-modal/ShareImportModal";

type UserType = UserData<{
  short_name?: string;
  language?: string;
}>;

type InvitationType = InvitationData<
  UserType,
  {
    surname: string;
  }
>;

type AccessType = AccessData<
  UserType,
  {
    name: string;
  }
>;

export const ShareModalExample = ({
  importFails,
  ...props
}: {
  linkSettings?: boolean;
  canUpdate?: boolean;
  canView?: boolean;
  allowFileImport?: boolean;
  importFails?: boolean;
}) => {
  const [userQuery, setUserQuery] = useState("");
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  const [invitations, setInvitations] = useState<InvitationType[]>(() => {
    const ids = [1];
    return ids.map((id) => ({
      id: id.toString(),
      surname: "Doe",
      role: "administrator",
      email: "john.doe.invitation@example.com " + id,
      user: {
        id: id.toString(),
        full_name: "John Doe " + id,
        email: "john.doe@example.com " + id,
      },
    }));
  });
  const [members, setMembers] = useState<AccessType[]>(() => {
    const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return ids.map((id) => ({
      id: id.toString(),
      name: "John Doe " + id,
      email: "john.doe@example.com " + id,
      role: id === 1 ? "reader" : "administrator",
      // Example: the first member cannot be deleted (e.g., last admin or current user)
      can_delete: id !== 1,
      user: {
        id: id.toString(),
        full_name: "John Doe " + id,
        email: "john.doe@example.com " + id,
      },
    }));
  });

  const invitationRoles = [
    { label: "Owner", value: "owner" },
    { label: "Admin", value: "administrator" },
    { label: "Editor", value: "editor" },
    { label: "Reader", value: "reader" },
  ];

  const getAccessRoles = (access: AccessType): DropdownMenuOption[] => {
    const isAdmin = access.role === "administrator";
    return [
      { label: "Admin", value: "administrator", isDisabled: false },
      {
        label: "Editor",
        value: "editor",
        isDisabled: isAdmin,
      },
      {
        label: "Reader",
        value: "reader",
        isDisabled: isAdmin,
      },
    ];
  };

  useEffect(() => {
    if (userQuery === "") {
      setUsers([]);
      return;
    }
    const id1 = Math.floor(Math.random() * 999) + 1;
    const id2 = Math.floor(Math.random() * 999) + 1;

    setLoading(true);
    setTimeout(() => {
      setUsers([
        {
          id: id1.toString(),
          full_name: "John Doe " + id1,
          email: "john.doe@example.com " + id1,
        },
        {
          id: id2.toString(),
          full_name: "Jane Doe " + id2,
          email: "jane.doe@example.com " + id2,
        },
      ]);
      setLoading(false);
    }, 200);
  }, [userQuery]);

  const onUpdateAccess = (access: AccessType, role: string) => {
    setMembers(
      members.map((member) =>
        member.id === access.id ? { ...member, role } : member,
      ),
    );
  };

  const onDeleteAccess = (access: AccessType) => {
    setMembers(members.filter((member) => member.id !== access.id));
  };

  const onUpdateInvitation = (invit: InvitationType, role: string) => {
    setInvitations(
      invitations.map((invitation) =>
        invitation.id === invit.id ? { ...invitation, role } : invitation,
      ),
    );
  };

  const onDeleteInvitation = (invitation: InvitationType) => {
    setInvitations(invitations.filter((invit) => invit.id !== invitation.id));
  };

  /**
   * Mock backend for the contacts import: after 1s of "processing", each
   * imported row is randomly registered as a pending invitation or as a
   * member, and the lists refresh with the emails and roles from the file.
   * When `importFails` is set, the "server" rejects the file instead: the
   * promise resolves false so the import modal stays open and the error is
   * displayed on the uploader through `importErrorMessage`.
   */
  const onImportContacts = (rows: ShareImportRow[]): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (importFails) {
          resolve(false);
          return;
        }
        const newInvitations: InvitationType[] = [];
        const newMembers: AccessType[] = [];
        rows.forEach((row, index) => {
          const id = `import-${Date.now()}-${index}`;
          const user = {
            id,
            full_name: row.email.split("@")[0],
            email: row.email,
          };
          if (Math.random() < 0.5) {
            newInvitations.push({
              id,
              surname: "",
              role: row.role,
              email: row.email,
              user,
            });
          } else {
            newMembers.push({
              id,
              name: user.full_name,
              role: row.role,
              can_delete: true,
              user,
            });
          }
        });
        setInvitations((prev) => [...prev, ...newInvitations]);
        setMembers((prev) => [...prev, ...newMembers]);
        resolve(true);
      }, 1000);
    });
  };

  return (
    <ShareModal
      isOpen={true}
      onClose={() => {}}
      accesses={members}
      invitations={invitations}
      onSearchUsers={setUserQuery}
      onInviteUser={console.log}
      onUpdateAccess={onUpdateAccess}
      accessRoleTopMessage={(access) => {
        if (access.role === "administrator") {
          return "Vous ne pouvez pas modifier le rôle d'un administrateur";
        }
        return undefined;
      }}
      loading={loading}
      onDeleteAccess={onDeleteAccess}
      onUpdateInvitation={onUpdateInvitation}
      onDeleteInvitation={onDeleteInvitation}
      invitationRoles={invitationRoles}
      searchUsersResult={users}
      hasNextMembers={true}
      onLoadNextMembers={() => {
        console.log("LOAD NEXT MEMBERS");
      }}
      canUpdate={props.canUpdate ?? true}
      canView={props.canView ?? true}
      allowFileImport={props.allowFileImport}
      onImportContacts={onImportContacts}
      importErrorMessage={
        importFails
          ? "The server could not process the file :(. Please try again."
          : undefined
      }
      hasNextInvitations={true}
      onLoadNextInvitations={() => {
        console.log("LOAD NEXT INVITATIONS");
      }}
      getAccessRoles={getAccessRoles}
      outsideSearchContent={
        <ShareModalCopyLinkFooter
          onCopyLink={() => {
            console.log("COPY LINK");
          }}
          onOk={() => {
            console.log("OK");
          }}
        />
      }
      {...props}
      linkReachChoices={[
        {
          value: "public",
          subText: "Public link",
        },
        {
          value: "restricted",
          subText: "Restricted link",
        },
      ]}
      topLinkReachMessage={<span>Top link reach message</span>}
      topLinkRoleMessage={<span>Top link role message</span>}
      linkRole="reader"
      showLinkRole={true}
      linkRoleChoices={[
        {
          value: "reader",
        },
        {
          value: "editor",
        },
      ]}
    />
  );
};
