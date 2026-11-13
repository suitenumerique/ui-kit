import { GenericSupportFormProps } from "../generic-support-form/types";

export type LaSuiteSupportFormProps = Pick<
  GenericSupportFormProps,
  | "isOpen"
  | "onOpenChange"
  | "onCancel"
  | "onSuccessClose"
  | "labels"
  | "emailPrivacyUrl"
  | "className"
  | "placement"
  | "shouldFlip"
  | "triggerRef"
  | "children"
> & {
  /**
   * Full URL of the anti-spam challenge, used as is, e.g.
   * `https://lasuite.numerique.gouv.fr/api/support/challenge`.
   */
  challengeUrl: string;
  /**
   * Full URL the request is posted to, used as is, e.g.
   * `https://lasuite.numerique.gouv.fr/api/support/deliver/`.
   */
  deliverUrl: string;
  /** Support channel of the app (`docs`, `fichiers`, `visio`…). */
  channel: string;
  /** Email of the current user. If valid, the form does not ask for it. */
  email?: string;
  /** Called once the request has been accepted by the support API. */
  onSuccess?: () => void;
  /** Called when the request fails. The form shows the error message too. */
  onError?: (error: Error) => void;
};

export type UseLaSuiteSupportApiOptions = {
  /** Full URL of the anti-spam challenge, used as is. */
  challengeUrl: string;
  /** Full URL the request is posted to, used as is. */
  deliverUrl: string;
  /** Support channel of the app, sent in the body and `X-Channel-ID`. */
  channel: string;
  /**
   * Minimum duration of a send, in milliseconds, so the sending state does
   * not flash. Defaults to 1500.
   */
  minDuration?: number;
};

export type LaSuiteSupportAttachment = {
  fileName: string;
  mimeType: string;
  /** File content in base64, without the `data:…;base64,` prefix. */
  data: string;
};

export type LaSuiteSupportRequestBody = {
  subject: string;
  textBody: string;
  email: string;
  channel: string;
  altcha: string;
  notify_sender: boolean;
  attachments: LaSuiteSupportAttachment[];
};
