import { ShareInvitationItem } from "./ShareInvitationItem";
import { ShareMemberItem } from "./ShareMemberItem";
import { SearchUserItem } from "./SearchUserItem";
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Share/Items",
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
};

export default meta;

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <div style={{ width: "450px", padding: "10px" }}>{children}</div>;
};

const roles = [
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" },
  { label: "Viewer", value: "viewer" },
];

export const InvitationItem = {
  render: () => (
    <Wrapper>
      <ShareInvitationItem
        invitation={{
          id: "1",
          email: "test@test.com",
          role: "admin",
          user: {
            id: "1",
            email: "test@test.com",
            full_name: "John Doe",
          },
        }}
        roles={roles}
        deleteInvitation={(invitation) =>
          alert(`Delete invitation ${invitation.id}`)
        }
      />
    </Wrapper>
  ),
};

export const MemberItem = {
  render: () => (
    <Wrapper>
      <ShareMemberItem
        accessData={{
          id: "1",
          email: "test@test.com",
          role: "admin",
          user: {
            id: "1",
            email: "test@test.com",
            full_name: "John Doe",
          },
        }}
        roles={roles}
        deleteAccess={(access) => alert(`Delete access ${access.id}`)}
      />
    </Wrapper>
  ),
};

export const MemberItemExplicitAccess = {
  render: () => (
    <Wrapper>
      <ShareMemberItem
        accessData={{
          id: "2",
          email: "explicit@test.com",
          role: "editor",
          is_explicit: true,
          user: {
            id: "2",
            email: "explicit@test.com",
            full_name: "Jane Doe",
          },
        }}
        roles={roles}
        deleteAccess={(access) => alert(`Delete access ${access.id}`)}
      />
    </Wrapper>
  ),
};

export const MemberItemImplicitAccess = {
  render: () => (
    <Wrapper>
      <ShareMemberItem
        accessData={{
          id: "3",
          email: "implicit@test.com",
          role: "editor",
          is_explicit: false,
          user: {
            id: "3",
            email: "implicit@test.com",
            full_name: "Bob Martin",
          },
        }}
        roles={roles}
        deleteAccess={(access) => alert(`Delete access ${access.id}`)}
      />
    </Wrapper>
  ),
};

export const SearchResultUserItem = {
  render: () => (
    <Wrapper>
      <SearchUserItem
        user={{
          id: "1",
          email: "test@test.com",
          full_name: "John Doe",
        }}
      />
    </Wrapper>
  ),
};
