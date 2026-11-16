import { RefObject } from "react";
import { Checkbox, Input } from ":/cunningham";
import { GenericSupportFormLabels } from "./types";

export type SupportFormEmailState = "default" | "error" | "success";

// Material icon shown at the end of the email field, by validation state.
const EMAIL_STATE_ICONS: Record<SupportFormEmailState, string | undefined> = {
  default: undefined,
  success: "check_circle",
  error: "error",
};

type SupportFormEmailProps = {
  labels: GenericSupportFormLabels;
  /** The "reply by email" checkbox. */
  showReplyCheckbox: boolean;
  wantsReply: boolean;
  onWantsReplyChange: (wantsReply: boolean) => void;
  /** The email field: shown when an email is needed and the app has none. */
  asksEmail: boolean;
  email: string;
  onEmailChange: (email: string) => void;
  onEmailBlur: () => void;
  emailState: SupportFormEmailState;
  emailError?: string;
  emailRef: RefObject<HTMLInputElement | null>;
  /** Link shown when an email is collected. */
  privacyUrl?: string;
  collectsEmail: boolean;
};

/** The "reply by email" checkbox, the email field and the privacy link. */
export const SupportFormEmail = ({
  labels,
  showReplyCheckbox,
  wantsReply,
  onWantsReplyChange,
  asksEmail,
  email,
  onEmailChange,
  onEmailBlur,
  emailState,
  emailError,
  emailRef,
  privacyUrl,
  collectsEmail,
}: SupportFormEmailProps) => {
  const stateIcon = EMAIL_STATE_ICONS[emailState];

  return (
    <div className="c__generic-support-form__email-section">
      {showReplyCheckbox && (
        <Checkbox
          label={labels.emailCheckbox}
          checked={wantsReply}
          onChange={(e) =>
            onWantsReplyChange((e.target as HTMLInputElement).checked)
          }
        />
      )}
      {asksEmail && (
        <Input
          ref={emailRef}
          type="email"
          autoComplete="email"
          label={labels.emailLabel}
          value={email}
          variant="classic"
          onChange={(e) => onEmailChange((e.target as HTMLInputElement).value)}
          onBlur={onEmailBlur}
          required
          state={emailState}
          aria-invalid={emailState === "error"}
          text={emailError}
          rightIcon={
            stateIcon && (
              <span className="material-icons" aria-hidden="true">
                {stateIcon}
              </span>
            )
          }
          fullWidth
        />
      )}
      {collectsEmail && privacyUrl && (
        <a
          href={privacyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="c__generic-support-form__email-section__privacy"
        >
          {labels.emailPrivacy}
        </a>
      )}
    </div>
  );
};
