import { ReactNode, RefObject } from "react";
import { DropdownMenuItem } from "../dropdown-menu/types";

export type FeedbackFormData = {
  category?: string;
  subject: string;
  message: string;
  files?: File[];
  email?: string;
};

export type FeedbackFormLabels = {
  title: string;
  subtitle: string;
  subject: string;
  subjectPlaceholder: string;
  message: string;
  messagePlaceholder: string;
  uploadFile: string;
  emailCheckbox: string;
  emailLabel: string;
  emailPrivacy: string;
  emailError: string;
  cancel: string;
  send: string;
  category: string;
};

export type FeedbackFormPlacement =
  | "bottom"
  | "bottom left"
  | "bottom right"
  | "bottom start"
  | "bottom end"
  | "top"
  | "top left"
  | "top right"
  | "top start"
  | "top end"
  | "left"
  | "right";

export type FeedbackFormProps = {
  categories?: DropdownMenuItem[];
  defaultCategory?: string;
  showEmailReply?: boolean;
  onSend: (data: FeedbackFormData) => void;
  onCancel?: () => void;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  labels?: Partial<FeedbackFormLabels>;
  emailPrivacyUrl?: string;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
  isSending?: boolean;
  className?: string;
  placement?: FeedbackFormPlacement;
  shouldFlip?: boolean;
  triggerRef?: RefObject<HTMLElement | null>;
  children?: ReactNode;
};
