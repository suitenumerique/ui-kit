import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@gouvfr-lasuite/cunningham-react";
import { FeedbackForm } from "./FeedbackForm";
import { FeedbackFormProps } from "./types";
import { DropdownMenuItem } from "../dropdown-menu/types";

const meta = {
  title: "Components/FeedbackForm",
  component: FeedbackForm,
  tags: ["autodocs"],
} satisfies Meta<typeof FeedbackForm>;

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

const FeedbackFormWrapper = (props: Omit<FeedbackFormProps, "children">) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <FeedbackForm
      {...props}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <Button onClick={() => setIsOpen(!isOpen)}>
        Contact us
      </Button>
    </FeedbackForm>
  );
};

export const Default: Story = {
  args: {
    onSend: (data) => console.log("Send:", data),
    children: <Button>Contact us</Button>,
  },
  render: () => (
    <FeedbackFormWrapper
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
    <FeedbackFormWrapper
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
    <FeedbackFormWrapper
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
    <FeedbackFormWrapper
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
    <FeedbackFormWrapper
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
    <FeedbackFormWrapper
      isSending={true}
      onSend={(data) => console.log("Send:", data)}
    />
  ),
};
