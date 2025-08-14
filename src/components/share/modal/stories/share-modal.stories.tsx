import { ShareModalExample } from "./ShareModalExample";
import { ShareModal } from "../ShareModal";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Share/Modal",
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
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
