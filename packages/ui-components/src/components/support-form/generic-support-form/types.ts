import { ReactNode, RefObject } from "react";
import { DropdownMenuItem } from "../../dropdown-menu/types";

export type GenericSupportFormData = {
  category?: string;
  subject: string;
  message: string;
  files?: File[];
  email?: string;
};

export type GenericSupportFormLabels = {
  title: string;
  subtitle: string;
  subject: string;
  subjectPlaceholder: string;
  subjectRequired: string;
  message: string;
  messagePlaceholder: string;
  messageRequired: string;
  uploadFile: string;
  /** Line shown under the upload button, e.g. the accepted types and size. */
  uploadHint?: string;
  /** Accessible name of a file chip's remove button. `{name}` is the file name. */
  removeFile: string;
  /** `{size}` is replaced by `maxFileSize`, formatted (e.g. "10 MB"). */
  fileTooLarge: string;
  fileTypeInvalid: string;
  /** `{max}` is replaced by `maxFiles`. */
  fileTooMany: string;
  emailCheckbox: string;
  emailLabel: string;
  emailPrivacy: string;
  emailRequired: string;
  emailError: string;
  cancel: string;
  send: string;
  sending: string;
  category: string;
  /** Shown when `onSend` rejects without an error message. */
  error: string;
  successTitle: string;
  successText: string;
  successClose: string;
};

export type GenericSupportFormPlacement =
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

export type GenericSupportFormProps = {
  categories?: DropdownMenuItem[];
  defaultCategory?: string;
  /** Show the "reply by email" checkbox. Ignored when `requireEmail` is set. */
  showEmailReply?: boolean;
  /**
   * Email of the current user, when the app knows it. If valid, the form does
   * not ask for it and sends it with the data.
   */
  email?: string;
  /**
   * Make the email mandatory: a required email field replaces the "reply by
   * email" checkbox (or nothing is shown when a valid `email` is given).
   */
  requireEmail?: boolean;
  /**
   * Called with the form data on submit, once it is valid. When it returns a
   * promise, the form shows its own sending state, then the success view when
   * it resolves, or the error message (`error.message`, or the `error` label)
   * when it rejects. Any other return value is ignored.
   */
  // `unknown` rather than `void | Promise<void>`: a union with void no longer
  // accepts callbacks that return a value, e.g. `(d) => mutateAsync(d)`.
  onSend: (data: GenericSupportFormData) => unknown;
  onCancel?: () => void;
  /** Called when the user closes the success view. */
  onSuccessClose?: () => void;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  labels?: Partial<GenericSupportFormLabels>;
  emailPrivacyUrl?: string;
  /** Maximum size of one file, in bytes. */
  maxFileSize?: number;
  /** Maximum number of attached files. */
  maxFiles?: number;
  /** MIME types (`image/png`, `image/*`) or extensions (`.txt`). */
  acceptedFileTypes?: string[];
  /** Sending state controlled by the app, for an `onSend` that returns void. */
  isSending?: boolean;
  className?: string;
  placement?: GenericSupportFormPlacement;
  shouldFlip?: boolean;
  triggerRef?: RefObject<HTMLElement | null>;
  children?: ReactNode;
};
