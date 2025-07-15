import { useEffect, useState } from "react";
import { ShareModal } from "../ShareModal";

import {
  AccessData,
  InvitationData,
  UserData,
} from ":/components/share/types.ts";
import { ShareModalCopyLinkFooter } from "../../utils/ShareModalCopyLinkFooter";
import { DropdownMenuOption } from ":/components/dropdown-menu";

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

export const ShareModalExample = (props: {
  linkSettings?: boolean;
  canUpdate?: boolean;
}) => {
  const [userQuery, setUserQuery] = useState("");
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState<InvitationType[]>(() => {
    const ids = [1];
    return ids.map((id) => ({
      id: id.toString(),
      surname: "Doe",
      role: "admin",
      email: "john.doe.invitation@example.com " + id,
      user: {
        id: id.toString(),
        full_name: "John Doe " + id,
        email: "john.doe@example.com " + id,
      },
    }));
  });
  const [members, setMembers] = useState<AccessType[]>(() => {
    const ids = [1, 2, 3, 4];
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
      {
        label: "Editor",
        value: "editor",
        isDisabled: isAdmin,
      },
      {
        label: "Viewer",
        value: "viewer",
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
    }, 2000);
  }, [userQuery]);

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

  const onUpdateInvitation = (invit: InvitationType, role: string) => {
    setInvitations(
      invitations.map((invitation) =>
        invitation.id === invit.id ? { ...invitation, role } : invitation
      )
    );
  };

  const onDeleteInvitation = (invitation: InvitationType) => {
    setInvitations(invitations.filter((invit) => invit.id !== invitation.id));
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
        if (access.role === "admin") {
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
        },
        {
          value: "restricted",
        },
      ]}
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
