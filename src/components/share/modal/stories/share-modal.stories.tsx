import type { Meta } from "@storybook/react";
import { useState } from "react";
import { ShareModalExample } from "./ShareModalExample";
import { ShareModal } from "../ShareModal";
import { UserData } from ":/components/share/types.ts";

// The docs page is the attached MDX guide: ./ShareModal.mdx
const meta: Meta<typeof ShareModal> = {
  title: "Components/Share/Modal",
  component: ShareModal,
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 700,
      },
    },
  },
  argTypes: {
    isOpen: {
      description: "Controls the modal open state",
      control: "boolean",
    },
    onClose: {
      description: "Callback called on close",
      control: false,
    },
    accesses: {
      description: "List of accesses (members with permissions)",
      control: false,
    },
    invitations: {
      description: "List of pending invitations",
      control: false,
    },
    invitationRoles: {
      description: "Available roles for invitations",
      control: false,
    },
    onSearchUsers: {
      description: "User search callback",
      control: false,
    },
    searchUsersResult: {
      description: "User search results",
      control: false,
    },
    onInviteUser: {
      description: "Callback when inviting user(s)",
      control: false,
    },
    onUpdateAccess: {
      description: "Callback when updating an access",
      control: false,
    },
    onDeleteAccess: {
      description: "Callback when deleting an access",
      control: false,
    },
    onDeleteInvitation: {
      description: "Callback when deleting an invitation",
      control: false,
    },
    canUpdate: {
      description: "Allows modifications (default: true)",
      control: "boolean",
    },
    canView: {
      description: "Shows the members list (default: true)",
      control: "boolean",
    },
    linkSettings: {
      description: "Enables link settings",
      control: "boolean",
    },
    linkReachChoices: {
      description: "Link reach options (public, restricted, etc.)",
      control: false,
    },
    linkRole: {
      description: "Current shared link role",
      control: false,
    },
    showLinkRole: {
      description: "Shows the link role selector",
      control: "boolean",
    },
    linkRoleChoices: {
      description: "Role options for the link",
      control: false,
    },
    onUpdateLinkReach: {
      description: "Callback when link reach changes",
      control: false,
    },
    onUpdateLinkRole: {
      description: "Callback when link role changes",
      control: false,
    },
    allowFileImport: {
      description:
        "Shows an 'Import contacts' menu on the members title (requires canUpdate)",
      control: "boolean",
    },
    onImportContacts: {
      description:
        "Async callback called with the rows parsed by the import contacts modal. Resolve `true` to close the modal, `false` (or throw) to keep it open. While pending the modal is locked and the import button shows a spinner",
      control: false,
    },
    importModalChildren: {
      description:
        "Extra content rendered inside the import contacts modal (e.g. an error Alert)",
      control: false,
    },
    hideInvitations: {
      description: "Hides the invitations section",
      control: "boolean",
    },
    hideMembers: {
      description: "Hides the members section",
      control: "boolean",
    },
    customTranslations: {
      description: "Custom translations for component texts",
      control: false,
    },
  },
};

export default meta;

/**
 * The full modal: user search with invitation flow, pending invitations,
 * members list with role management, link settings, and the "Import contacts"
 * menu on the members title (`allowFileImport={true}`) that opens the
 * `ShareImportModal`.
 */
export const Default = {
  render: () => <ShareModalExample linkSettings={true} allowFileImport={true} />,
};

const SELECTABLE_USERS: UserData<unknown>[] = [
  { id: "u1", full_name: "Amandine Salambo", email: "amandine@example.com" },
  { id: "u2", full_name: "Jakob Philips", email: "jakob@example.com" },
  { id: "u3", full_name: "Kaylynn George", email: "kaylynn@example.com" },
];

const SelectableShareModal = () => {
  const [, setSearch] = useState("");
  return (
    <ShareModal
      isOpen={true}
      onClose={() => {}}
      invitationRoles={[
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "Viewer", value: "viewer" },
      ]}
      onSearchUsers={setSearch}
      onInviteUser={(users, role) => console.log("INVITE", users, role)}
      searchUsersResult={SELECTABLE_USERS}
      accesses={[]}
      invitations={[]}
    />
  );
};

/**
 * Demonstrates the ergonomic update: search a user, then the selected people
 * become chips inside the same container as the input (no separate gray frame),
 * with the role selector and invite button surfacing once a user is selected.
 */
export const UnifiedSearchField = {
  render: () => <SelectableShareModal />,
};

/**
 * Read-only mode (`canUpdate={false}`): the search input, role dropdowns,
 * deletion actions and the import contacts menu are all hidden — the modal
 * only displays the current accesses and link settings.
 */
export const DefaultReadOnly = {
  render: () => <ShareModalExample linkSettings={true} canUpdate={false} />,
};

/**
 * A working `onImportContacts` flow: open the "..." menu on the members title,
 * import a two-column CSV/XLSX file, and a mock backend "processes" it for
 * 1 s before refreshing the lists — each row of the file is randomly
 * registered as a pending invitation or as a member, keeping the real emails
 * and roles from the file. While the import is pending the modal is locked
 * and the import button shows a spinner; it closes once the promise
 * resolves `true`.
 */
export const ImportContacts = {
  render: () => <ShareModalExample allowFileImport={true} />,
};

/**
 * Failing import: the mock server resolves `false` after a delay, so the
 * import modal stays open (non-closable while pending, import button showing
 * a spinner) and the consumer surfaces the error as an Alert through
 * `importModalChildren`.
 */
export const ImportContactsFailure = {
  render: () => <ShareModalExample allowFileImport={true} importFails={true} />,
};

/**
 * Invitations and members without the link settings footer
 * (`linkSettings` omitted).
 */
export const WithoutLinkSettings = {
  render: () => <ShareModalExample />,
};

/**
 * `canView={false}`: the members list is replaced by an explanatory message
 * (customizable via `cannotViewMessage` / `cannotViewChildren`).
 */
export const DefaultCannotView = {
  render: () => <ShareModalExample canView={false} canUpdate={false} />,
};

/**
 * Same as CannotView but keeping the link settings footer visible.
 */
export const DefaultCannotViewWithLinkSettings = {
  render: () => (
    <ShareModalExample canView={false} canUpdate={false} linkSettings={true} />
  ),
};

/**
 * Link-settings-only mode (`hideInvitations` + `hideMembers`): the modal is
 * reduced to the link reach/role dropdowns. A disabled reach choice shows the
 * `subText`/`isDisabled` option flags.
 */
export const LinkSettingsOnly = {
  render: () => (
    <ShareModal
      isOpen={true}
      onClose={() => {}}
      linkSettings={true}
      linkReachChoices={[
        {
          value: "public",
        },
        {
          value: "restricted",
          subText: "You don't have permission to modify this reach",
          isDisabled: true,
        },
      ]}
      onUpdateLinkReach={(value) => {
        console.log("UPDATE LINK REACH", value);
      }}
      hideInvitations={true}
      hideMembers={true}
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
      onUpdateLinkRole={(value) => {
        console.log("UPDATE LINK ROLE", value);
      }}
    ></ShareModal>
  ),
};

/**
 * Link-settings-only in read-only mode: both dropdowns are rendered disabled.
 */
export const LinkSettingsOnlyReadOnly = {
  render: () => (
    <ShareModal
      isOpen={true}
      onClose={() => {}}
      linkSettings={true}
      linkReachChoices={[
        {
          value: "public",
        },
        {
          value: "restricted",
        },
      ]}
      hideInvitations={true}
      hideMembers={true}
      canUpdate={false}
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
    ></ShareModal>
  ),
};

/**
 * Link settings without the role selector (`showLinkRole` omitted): only the
 * link reach can be changed.
 */
export const LinkSettingsOnlyWithoutRole = {
  render: () => (
    <ShareModal
      isOpen={true}
      onClose={() => {}}
      linkSettings={true}
      linkReachChoices={[
        {
          value: "public",
        },
        {
          value: "restricted",
        },
      ]}
      hideInvitations={true}
      hideMembers={true}
    ></ShareModal>
  ),
};

/**
 * Reach-only link settings in read-only mode.
 */
export const LinkSettingsOnlyWithoutRoleReadOnly = {
  render: () => (
    <ShareModal
      isOpen={true}
      onClose={() => {}}
      linkSettings={true}
      linkReachChoices={[
        {
          value: "public",
        },
        {
          value: "restricted",
        },
      ]}
      hideInvitations={true}
      hideMembers={true}
      canUpdate={false}
    ></ShareModal>
  ),
};

/**
 * Overriding built-in texts with the `customTranslations` prop — here the
 * description of the "public" link reach choice.
 */
export const LinkSettingsCustomTexts = {
  render: () => (
    <ShareModal
      isOpen={true}
      onClose={() => {}}
      linkSettings={true}
      linkReachChoices={[
        {
          value: "public",
        },
        {
          value: "restricted",
        },
      ]}
      onUpdateLinkReach={(value) => {
        console.log("UPDATE LINK REACH", value);
      }}
      hideInvitations={true}
      hideMembers={true}
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
      onUpdateLinkRole={(value) => {
        console.log("UPDATE LINK ROLE", value);
      }}
      customTranslations={{
        "components.share.linkSettings.reach.choices.public.description":
          "Yay custom text there, public link reach.",
      }}
    ></ShareModal>
  ),
};
