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
        title: "Contact the team",
        subtitle:
          "Bug, idea, question, or compliment — the team reads everything and will get back to you if needed.",
        subject: "Subject",
        message: "Your message",
        uploadFile: "Attach a file",
        emailCheckbox: "I want to receive a reply by email",
        emailLabel: "E-mail",
        emailPrivacy: "See how your email is used",
        emailError: "Please enter a valid email address.",
        cancel: "Cancel",
        send: "Send",
        category: "Category",
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
