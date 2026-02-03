import type { Meta } from "@storybook/react";
import { Description, Title, Subtitle, ArgTypes } from "@storybook/blocks";
import { ShareModalExample } from "./ShareModalExample";
import { ShareModal } from "../ShareModal";

/**
 * The `ShareModal` component displays a sharing modal with access management, invitations, and link settings.
 *
 * ## Installation
 *
 * ```tsx
 * import { ShareModal } from "@gouvfr-lasuite/ui-kit";
 * ```
 *
 * ## Basic Usage
 *
 * ```tsx
 * <ShareModal
 *   isOpen={true}
 *   onClose={() => setOpen(false)}
 *   accesses={members}
 *   invitations={invitations}
 *   invitationRoles={[
 *     { label: "Admin", value: "admin" },
 *     { label: "Viewer", value: "viewer" },
 *   ]}
 *   onSearchUsers={setSearchQuery}
 *   searchUsersResult={searchResults}
 *   onInviteUser={(users, role) => invite(users, role)}
 *   onUpdateAccess={(access, role) => updateAccess(access, role)}
 *   onDeleteAccess={(access) => deleteAccess(access)}
 * />
 * ```
 *
 * ## Data Types
 *
 * ### UserData
 * | Property | Type | Description |
 * |----------|------|-------------|
 * | `id` | `string` | Unique identifier |
 * | `full_name` | `string` | Full name |
 * | `email` | `string` | Email address |
 *
 * ### AccessData
 * | Property | Type | Description |
 * |----------|------|-------------|
 * | `id` | `string` | Access identifier |
 * | `role` | `string` | Assigned role |
 * | `user` | `UserData` | Related user |
 * | `is_explicit` | `boolean?` | If `false`, inherited access (no deletion) |
 * | `can_delete` | `boolean?` | If `false`, prevents deletion |
 *
 * ### InvitationData
 * | Property | Type | Description |
 * |----------|------|-------------|
 * | `id` | `string` | Invitation identifier |
 * | `role` | `string` | Proposed role |
 * | `email` | `string` | Invitee email |
 * | `user` | `UserData` | User data |
 *
 * ## Access Deletion Control
 *
 * | `is_explicit` | `can_delete` | Deletion allowed |
 * |---------------|--------------|------------------|
 * | `false` | - | No (implicit access) |
 * | `true`/`undefined` | `false` | No |
 * | `true`/`undefined` | `true`/`undefined` | Yes |
 *
 * ### Example: Prevent deletion of the last admin
 *
 * ```tsx
 * const accesses = rawAccesses.map((access, _, all) => ({
 *   ...access,
 *   can_delete: all.length > 1 || access.user.id !== currentUserId,
 * }));
 * ```
 *
 * ## Link Settings
 *
 * Enable with `linkSettings={true}`:
 *
 * ```tsx
 * <ShareModal
 *   linkSettings={true}
 *   linkReachChoices={[
 *     { value: "public", subText: "Everyone" },
 *     { value: "restricted", subText: "Members only" },
 *   ]}
 *   linkRole="reader"
 *   showLinkRole={true}
 *   linkRoleChoices={[
 *     { value: "reader" },
 *     { value: "editor" },
 *   ]}
 *   onUpdateLinkReach={(value) => updateReach(value)}
 *   onUpdateLinkRole={(value) => updateRole(value)}
 * />
 * ```
 *
 * ## Read-only Mode
 *
 * Use `canUpdate={false}` to disable modifications.
 * Use `canView={false}` to hide the members list.
 */
const meta: Meta<typeof ShareModal> = {
  title: "Components/Share/Modal",
  component: ShareModal,
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <ArgTypes />
        </>
      ),
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

export const Default = {
  render: () => <ShareModalExample linkSettings={true} />,
};

export const DefaultReadOnly = {
  render: () => <ShareModalExample linkSettings={true} canUpdate={false} />,
};

export const WithoutLinkSettings = {
  render: () => <ShareModalExample />,
};

export const DefaultCannotView = {
  render: () => <ShareModalExample canView={false} canUpdate={false} />,
};

export const DefaultCannotViewWithLinkSettings = {
  render: () => (
    <ShareModalExample canView={false} canUpdate={false} linkSettings={true} />
  ),
};

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
