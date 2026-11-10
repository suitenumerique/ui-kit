import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from ":/cunningham";
import { GenericSupportForm } from "./GenericSupportForm";
import { GenericSupportFormProps } from "./types";
import { DropdownMenuItem } from "../../dropdown-menu/types";

const meta = {
  title: "Components/SupportForm/GenericSupportForm",
  component: GenericSupportForm,
  tags: ["autodocs"],
  parameters: {
    // The stories open their popover on load: on the docs page, each one gets
    // its own frame so the popovers don't pile up over the page.
    docs: { story: { inline: false, height: "720px" } },
  },
} satisfies Meta<typeof GenericSupportForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const categoryOptions: DropdownMenuItem[] = [
  {
    label: "Bug",
    value: "bug",
    icon: <span className="material-icons">bug_report</span>,
  },
  {
    label: "Feature request",
    value: "feature",
    icon: <span className="material-icons">lightbulb</span>,
  },
  {
    label: "Question",
    value: "question",
    icon: <span className="material-icons">help</span>,
  },
  {
    label: "Other",
    value: "other",
    icon: <span className="material-icons">more_horiz</span>,
  },
];

const GenericSupportFormWrapper = (props: Omit<GenericSupportFormProps, "children">) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <GenericSupportForm
      {...props}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <Button onClick={() => setIsOpen(!isOpen)}>
        Contact us
      </Button>
    </GenericSupportForm>
  );
};

export const Default: Story = {
  args: {
    onSend: (data) => console.log("Send:", data),
    children: <Button>Contact us</Button>,
  },
  render: () => (
    <GenericSupportFormWrapper
      onSend={(data) => console.log("Send:", data)}
      emailPrivacyUrl="#"
    />
  ),
};

export const WithCategories: Story = {
  args: {
    onSend: (data) => console.log("Send:", data),
    children: <Button>Contact us</Button>,
  },
  render: () => (
    <GenericSupportFormWrapper
      categories={categoryOptions}
      defaultCategory="bug"
      showEmailReply={false}
      onSend={(data) => console.log("Send:", data)}
    />
  ),
};

export const WithCategoriesAndEmail: Story = {
  args: {
    onSend: (data) => console.log("Send:", data),
    children: <Button>Contact us</Button>,
  },
  render: () => (
    <GenericSupportFormWrapper
      categories={categoryOptions}
      defaultCategory="bug"
      showEmailReply={true}
      emailPrivacyUrl="#"
      onSend={(data) => console.log("Send:", data)}
    />
  ),
};

export const NoEmailReply: Story = {
  args: {
    onSend: (data) => console.log("Send:", data),
    children: <Button>Contact us</Button>,
  },
  render: () => (
    <GenericSupportFormWrapper
      showEmailReply={false}
      onSend={(data) => console.log("Send:", data)}
    />
  ),
};

export const CustomLabels: Story = {
  args: {
    onSend: (data) => console.log("Send:", data),
    children: <Button>Contactez-nous</Button>,
  },
  render: () => (
    <GenericSupportFormWrapper
      onSend={(data) => console.log("Envoi:", data)}
      emailPrivacyUrl="#"
      labels={{
        title: "Contacter l'\u00e9quipe",
        subtitle:
          "Bug, id\u00e9e, question ou compliment \u2014 l'\u00e9quipe lit tout et reviendra vers vous si n\u00e9cessaire.",
        subject: "Sujet",
        message: "Votre message",
        uploadFile: "Joindre un fichier",
        emailCheckbox: "Je souhaite recevoir une r\u00e9ponse par e-mail",
        emailLabel: "E-mail",
        emailPrivacy: "Voir comment votre e-mail est utilis\u00e9",
        emailError: "Veuillez saisir une adresse e-mail valide.",
        cancel: "Annuler",
        send: "Envoyer",
        category: "Cat\u00e9gorie",
      }}
    />
  ),
};

export const SendingState: Story = {
  args: {
    onSend: (data) => console.log("Send:", data),
    children: <Button>Contact us</Button>,
  },
  render: () => (
    <GenericSupportFormWrapper
      isSending={true}
      onSend={(data) => console.log("Send:", data)}
    />
  ),
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * `onSend` returns a promise: the form shows its sending state, then the
 * success view once it resolves.
 */
export const AsyncSuccess: Story = {
  args: {
    onSend: (data) => console.log("Send:", data),
    children: <Button>Contact us</Button>,
  },
  render: () => (
    <GenericSupportFormWrapper
      onSend={async (data) => {
        console.log("Send:", data);
        await wait(1500);
      }}
    />
  ),
};

/** `onSend` rejects: the error message is shown above the buttons. */
export const AsyncError: Story = {
  args: {
    onSend: (data) => console.log("Send:", data),
    children: <Button>Contact us</Button>,
  },
  render: () => (
    <GenericSupportFormWrapper
      onSend={async () => {
        await wait(1000);
        throw new Error("Too many requests. Please try again later.");
      }}
    />
  ),
};

/**
 * A required email field replaces the "reply by email" checkbox, and files
 * are limited in number, type and size.
 */
export const RequiredEmailAndFileRules: Story = {
  args: {
    onSend: (data) => console.log("Send:", data),
    children: <Button>Contact us</Button>,
  },
  render: () => (
    <GenericSupportFormWrapper
      requireEmail
      maxFiles={1}
      maxFileSize={10 * 1024 * 1024}
      acceptedFileTypes={["image/png", "image/jpeg", "image/gif", "text/plain"]}
      labels={{
        uploadHint: "Image (png, jpg, gif) or text file (txt), up to 10 MB",
      }}
      onSend={async (data) => {
        console.log("Send:", data);
        await wait(1000);
      }}
    />
  ),
};

/** The app knows the user's email: the form does not ask for it. */
export const KnownEmail: Story = {
  args: {
    onSend: (data) => console.log("Send:", data),
    children: <Button>Contact us</Button>,
  },
  render: () => (
    <GenericSupportFormWrapper
      requireEmail
      email="jean.dupont@example.gouv.fr"
      onSend={async (data) => {
        console.log("Send:", data);
        await wait(1000);
      }}
    />
  ),
};
