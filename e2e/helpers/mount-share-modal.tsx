import { useEffect, useState } from "react";
import { CunninghamProvider } from "../../src/components/Provider/Provider";
import { ShareModal } from "../../src/components/share/modal/ShareModal";
import { ShareModalCopyLinkFooter } from "../../src/components/share/utils/ShareModalCopyLinkFooter";
import {
  AccessData,
  InvitationData,
  UserData,
} from "../../src/components/share/types";
import { DropdownMenuOption } from "../../src/components/dropdown-menu";
import { CustomTranslations } from "../../src/hooks/useCustomTranslations";

// Playwright CT bridges function props as one-way dispatchers, so tests
// describe scenarios with plain serializable data and this helper — which runs
// in the browser — builds the real callbacks locally. Callback invocations are
// recorded on `window.__shareModalCalls` so tests can assert them via
// `page.evaluate`.

export type ShareModalCall = { name: string } & Record<string, unknown>;

declare global {
  interface Window {
    __shareModalCalls: ShareModalCall[];
    __resolveImport?: (success: boolean) => void;
  }
}

const useCallRecorder = () => {
  useEffect(() => {
    window.__shareModalCalls = [];
  }, []);
  return (call: ShareModalCall) => {
    (window.__shareModalCalls ??= []).push(call);
  };
};

type TestUser = UserData<object>;
type TestInvitation = InvitationData<object, object>;
type TestAccess = AccessData<object, object>;

// Search results must keep stable object references: ShareModal excludes
// pending users from the results with an identity-based `includes`.
const directory: TestUser[] = [
  { id: "u1", full_name: "Alice Martin", email: "alice@example.com" },
  { id: "u2", full_name: "Bob Martin", email: "bob@example.com" },
  { id: "u3", full_name: "Alice Bernard", email: "alice.bernard@example.com" },
  { id: "u4", full_name: "Amandine Salambo", email: "amandine@example.com" },
  { id: "u5", full_name: "Jakob Philips", email: "jakob@example.com" },
  { id: "u6", full_name: "Kaylynn George", email: "kaylynn@example.com" },
  { id: "u7", full_name: "Charlotte Dubois", email: "charlotte@example.com" },
  { id: "u8", full_name: "Sophie Moreau", email: "sophie@example.com" },
  {
    id: "u9",
    full_name: "Christopher Martin",
    email: "christopher@example.com",
  },
];

// Mirrors the ShareModalExample story seed: the first member is a reader that
// cannot be deleted (e.g. current user), the others are admins.
const makeMembers = (count: number): TestAccess[] =>
  Array.from({ length: count }, (_, index) => {
    const id = (index + 1).toString();
    return {
      id,
      role: index === 0 ? "reader" : "admin",
      can_delete: index !== 0,
      user: {
        id,
        full_name: `John Doe ${id}`,
        email: `john.doe.${id}@example.com`,
      },
    };
  });

const makeInvitations = (count: number): TestInvitation[] =>
  Array.from({ length: count }, (_, index) => {
    const id = (index + 1).toString();
    return {
      id,
      role: "admin",
      email: `invited.${id}@example.com`,
      user: {
        id: `invited-${id}`,
        full_name: "",
        email: `invited.${id}@example.com`,
      },
    };
  });

const invitationRoles: DropdownMenuOption[] = [
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" },
  { label: "Reader", value: "reader" },
];

const getAccessRoles = (access: TestAccess): DropdownMenuOption[] => [
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor", isDisabled: access.role === "admin" },
  { label: "Reader", value: "reader", isDisabled: access.role === "admin" },
];

export const ADMIN_TOP_MESSAGE =
  "You cannot change the role of an administrator";

interface TestShareModalProps {
  canUpdate?: boolean;
  canView?: boolean;
  linkSettings?: boolean;
  showLinkRole?: boolean;
  /** false renders empty linkRoleChoices to hide the role dropdown. */
  withLinkRoleChoices?: boolean;
  allowFileImport?: boolean;
  maxImportRows?: number;
  /** Value onImportContacts resolves with (defaults to true: close). */
  importResult?: boolean;
  /** Import stays pending until the test calls window.__resolveImport(value). */
  holdImport?: boolean;
  importErrorMessage?: string;
  /**
   * Set as importErrorMessage from inside onImportContacts, right before it
   * resolves, mirroring consumers that surface the server error of a failed
   * import.
   */
  dynamicImportErrorMessage?: string;
  withImportModalChildren?: boolean;
  hideMembers?: boolean;
  hideInvitations?: boolean;
  membersCount?: number;
  invitationsCount?: number;
  hasNextMembers?: boolean;
  hasNextInvitations?: boolean;
  /** Searches never resolve: loading stays true forever. */
  holdSearch?: boolean;
  /** The user directory returns no result for any query. */
  emptySearchResults?: boolean;
  withGetAccessRoles?: boolean;
  withAccessRoleTopMessage?: boolean;
  withTopLinkMessages?: boolean;
  withFooter?: boolean;
  withCannotViewChildren?: boolean;
  modalTitle?: string;
  cannotViewMessage?: string;
  customTranslations?: Record<string, string>;
}

export const TestShareModal = ({
  canUpdate = true,
  canView = true,
  linkSettings = false,
  showLinkRole = true,
  withLinkRoleChoices = true,
  allowFileImport = false,
  maxImportRows,
  importResult = true,
  holdImport = false,
  importErrorMessage,
  dynamicImportErrorMessage,
  withImportModalChildren = false,
  hideMembers = false,
  hideInvitations = false,
  membersCount = 4,
  invitationsCount = 1,
  hasNextMembers = false,
  hasNextInvitations = false,
  holdSearch = false,
  emptySearchResults = false,
  withGetAccessRoles = true,
  withAccessRoleTopMessage = false,
  withTopLinkMessages = false,
  withFooter = true,
  withCannotViewChildren = false,
  modalTitle,
  cannotViewMessage,
  customTranslations,
}: TestShareModalProps) => {
  const record = useCallRecorder();
  const [members, setMembers] = useState<TestAccess[]>(() =>
    makeMembers(membersCount),
  );
  const [invitations, setInvitations] = useState<TestInvitation[]>(() =>
    makeInvitations(invitationsCount),
  );
  const [searchUsersResult, setSearchUsersResult] = useState<TestUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [asyncImportError, setAsyncImportError] = useState<string>();

  const onSearchUsers = (query: string) => {
    record({ name: "search", query });
    if (query === "") {
      setSearchUsersResult([]);
      setLoading(false);
      return;
    }
    if (holdSearch) {
      setLoading(true);
      return;
    }
    if (emptySearchResults) {
      setSearchUsersResult([]);
      return;
    }
    const lowered = query.toLowerCase();
    setSearchUsersResult(
      directory.filter(
        (user) =>
          user.full_name.toLowerCase().includes(lowered) ||
          user.email.toLowerCase().includes(lowered),
      ),
    );
  };

  const onInviteUser = (users: TestUser[], role: string) => {
    record({ name: "invite", emails: users.map((user) => user.email), role });
    setMembers((prev) => [
      ...prev,
      ...users.map((user) => ({
        id: `invited-${user.id}`,
        role,
        can_delete: true,
        user,
      })),
    ]);
  };

  return (
    <CunninghamProvider currentLocale="en-US">
      <ShareModal
        isOpen={true}
        onClose={() => record({ name: "close" })}
        modalTitle={modalTitle}
        canUpdate={canUpdate}
        canView={canView}
        cannotViewMessage={cannotViewMessage}
        cannotViewChildren={
          withCannotViewChildren ? (
            <p data-testid="cannot-view-children">Request access</p>
          ) : undefined
        }
        hideMembers={hideMembers}
        hideInvitations={hideInvitations}
        accesses={members}
        invitations={invitations}
        invitationRoles={invitationRoles}
        getAccessRoles={withGetAccessRoles ? getAccessRoles : undefined}
        accessRoleTopMessage={
          withAccessRoleTopMessage
            ? (access) =>
                access.role === "admin" ? ADMIN_TOP_MESSAGE : undefined
            : undefined
        }
        onSearchUsers={onSearchUsers}
        searchUsersResult={searchUsersResult}
        loading={loading}
        onInviteUser={onInviteUser}
        onUpdateAccess={(access, role) => {
          record({ name: "update-access", id: access.id, role });
          setMembers((prev) =>
            prev.map((member) =>
              member.id === access.id ? { ...member, role } : member,
            ),
          );
        }}
        onDeleteAccess={(access) => {
          record({ name: "delete-access", id: access.id });
          setMembers((prev) =>
            prev.filter((member) => member.id !== access.id),
          );
        }}
        onUpdateInvitation={(invitation, role) => {
          record({ name: "update-invitation", id: invitation.id, role });
          setInvitations((prev) =>
            prev.map((item) =>
              item.id === invitation.id ? { ...item, role } : item,
            ),
          );
        }}
        onDeleteInvitation={(invitation) => {
          record({ name: "delete-invitation", id: invitation.id });
          setInvitations((prev) =>
            prev.filter((item) => item.id !== invitation.id),
          );
        }}
        hasNextMembers={hasNextMembers}
        onLoadNextMembers={() => record({ name: "load-next-members" })}
        hasNextInvitations={hasNextInvitations}
        onLoadNextInvitations={() => record({ name: "load-next-invitations" })}
        allowFileImport={allowFileImport}
        maxImportRows={maxImportRows}
        importErrorMessage={asyncImportError ?? importErrorMessage}
        onImportContacts={(rows) => {
          record({ name: "import-contacts", rows });
          if (holdImport) {
            return new Promise<boolean>((resolve) => {
              window.__resolveImport = resolve;
            });
          }
          if (dynamicImportErrorMessage && !importResult) {
            setAsyncImportError(dynamicImportErrorMessage);
          }
          return importResult;
        }}
        onImportFileChange={() => setAsyncImportError(undefined)}
        importModalChildren={
          withImportModalChildren ? (
            <p data-testid="import-modal-children">Import failed</p>
          ) : undefined
        }
        linkSettings={linkSettings}
        linkReach="public"
        linkReachChoices={[{ value: "public" }, { value: "restricted" }]}
        onUpdateLinkReach={(value) =>
          record({ name: "update-link-reach", value })
        }
        linkRole="reader"
        showLinkRole={showLinkRole}
        linkRoleChoices={
          withLinkRoleChoices ? [{ value: "reader" }, { value: "editor" }] : []
        }
        onUpdateLinkRole={(value) => record({ name: "update-link-role", value })}
        topLinkReachMessage={
          withTopLinkMessages ? <span>Top link reach message</span> : undefined
        }
        topLinkRoleMessage={
          withTopLinkMessages ? <span>Top link role message</span> : undefined
        }
        customTranslations={customTranslations as CustomTranslations}
        outsideSearchContent={
          withFooter ? (
            <ShareModalCopyLinkFooter
              onCopyLink={() => record({ name: "copy-link" })}
              onOk={() => record({ name: "ok" })}
            />
          ) : undefined
        }
      />
    </CunninghamProvider>
  );
};
