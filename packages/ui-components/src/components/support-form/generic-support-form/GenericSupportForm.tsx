import {
  FormEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import { Popover } from "react-aria-components";
import { Input, TextArea } from ":/cunningham";
import type { ButtonElement } from ":/components/button";
import { useCunningham } from ":/components/provider";
import { GenericSupportFormProps } from "./types";
import { useSupportFormLabels } from "./useSupportFormLabels";
import { useSupportFormFiles } from "./useSupportFormFiles";
import { SupportFormHeader } from "./SupportFormHeader";
import { SupportFormSuccess } from "./SupportFormSuccess";
import { SupportFormCategory } from "./SupportFormCategory";
import { SupportFormAttachments } from "./SupportFormAttachments";
import { SupportFormEmail, SupportFormEmailState } from "./SupportFormEmail";
import { SupportFormFooter } from "./SupportFormFooter";
import {
  getFieldState,
  getKnownEmail,
  getRequiredError,
  getSendErrorMessage,
  isPromiseLike,
  isValidEmail,
} from "./utils";

type SendStatus = "idle" | "sending" | "success";

export const GenericSupportForm = ({
  categories,
  defaultCategory,
  showEmailReply = true,
  email: knownEmailProp,
  requireEmail = false,
  onSend,
  onCancel,
  onSuccessClose,
  isOpen = false,
  onOpenChange,
  labels: labelsOverride,
  emailPrivacyUrl,
  maxFileSize,
  maxFiles,
  acceptedFileTypes,
  isSending = false,
  className,
  placement = "bottom",
  shouldFlip,
  triggerRef: externalTriggerRef,
  children,
}: GenericSupportFormProps) => {
  const { t } = useCunningham();
  const labels = useSupportFormLabels(labelsOverride);
  const id = useId();
  const titleId = `${id}-title`;
  const internalTriggerRef = useRef<HTMLDivElement>(null);
  const triggerRef = externalTriggerRef || internalTriggerRef;
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const successCloseRef = useRef<ButtonElement>(null);
  // Each send gets a number, so a late answer to an old send is ignored.
  const sendAttemptRef = useRef(0);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [wantsReply, setWantsReply] = useState(false);
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<SendStatus>("idle");
  const [sendError, setSendError] = useState<string>();
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const attachments = useSupportFormFiles({
    labels,
    maxFiles,
    maxFileSize,
    acceptedFileTypes,
  });
  const { files, resetFiles, clearFileError } = attachments;

  const isSuccess = status === "success";
  const isBusy = isSending || status === "sending";

  // Email: given by the app, asked in a required field, or offered through
  // the "reply by email" checkbox.
  const knownEmail = getKnownEmail(knownEmailProp);
  const showReplyCheckbox = !requireEmail && showEmailReply;
  const collectsEmail = requireEmail || (showReplyCheckbox && wantsReply);
  const asksEmail = collectsEmail && !knownEmail;

  const subjectError = getRequiredError(
    submitted,
    subject,
    labels.subjectRequired,
  );
  const messageError = getRequiredError(
    submitted,
    message,
    labels.messageRequired,
  );

  const getEmailProblem = () => {
    if (!asksEmail) return undefined;
    if (!email.trim()) return labels.emailRequired;
    if (!isValidEmail(email.trim())) return labels.emailError;
    return undefined;
  };
  const emailProblem = getEmailProblem();
  // The email is checked once the user left the field or tried to send.
  const emailChecked = submitted || emailTouched;
  let emailError: string | undefined;
  let emailState: SupportFormEmailState = "default";
  if (emailChecked) {
    emailError = emailProblem;
    emailState = "success";
    if (emailError) emailState = "error";
  }

  const resetForm = useCallback(() => {
    // Ignore the answer of a send started before the reset.
    sendAttemptRef.current++;
    setSubject("");
    setMessage("");
    resetFiles();
    setWantsReply(false);
    setEmail("");
    setEmailTouched(false);
    setSubmitted(false);
    setStatus("idle");
    setSendError(undefined);
    setSelectedCategory(defaultCategory);
  }, [defaultCategory, resetFiles]);

  // When the form closes, drop the errors. After a successful send, also clear
  // the draft so the next opening starts empty. Otherwise the draft is kept, so
  // an accidental click outside does not lose the message.
  const wasOpenRef = useRef(isOpen);
  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      if (status === "success") {
        resetForm();
      } else {
        setSubmitted(false);
        setSendError(undefined);
        clearFileError();
      }
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, status, resetForm, clearFileError]);

  // Every way to close the form (Cancel, the close button, Escape, a click
  // outside) goes through here. A request already sent can't be taken back:
  // the form stays open until its result.
  const close = useCallback(() => {
    if (isBusy) return;
    onOpenChange?.(false);
    onCancel?.();
  }, [isBusy, onOpenChange, onCancel]);

  const handleCancel = useCallback(() => {
    if (isBusy) return;
    resetForm();
    close();
  }, [isBusy, resetForm, close]);

  const handleSuccessClose = useCallback(() => {
    onOpenChange?.(false);
    onSuccessClose?.();
  }, [onOpenChange, onSuccessClose]);

  // The close button, Escape and a click outside: after a send, they close
  // the success view, not a draft.
  const handleClose = () => {
    if (isSuccess) {
      handleSuccessClose();
      return;
    }
    close();
  };

  const getFirstInvalidField = () => {
    if (!subject.trim()) return subjectRef.current;
    if (!message.trim()) return messageRef.current;
    if (emailProblem) return emailRef.current;
    return null;
  };

  const getSentEmail = () => {
    if (!collectsEmail) return undefined;
    return knownEmail ?? email.trim();
  };

  const getSentFiles = () => {
    if (files.length === 0) return undefined;
    return files;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isBusy) return;
    setSubmitted(true);
    setSendError(undefined);

    // Move focus to the first invalid field, so screen reader and keyboard
    // users land on the error.
    const firstInvalid = getFirstInvalidField();
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const result = onSend({
      category: selectedCategory,
      subject: subject.trim(),
      message: message.trim(),
      files: getSentFiles(),
      email: getSentEmail(),
    });
    if (!isPromiseLike(result)) return;

    const attempt = ++sendAttemptRef.current;
    setStatus("sending");
    result.then(
      () => {
        if (attempt === sendAttemptRef.current) setStatus("success");
      },
      (error: unknown) => {
        if (attempt !== sendAttemptRef.current) return;
        setStatus("idle");
        setSendError(getSendErrorMessage(error, labels.error));
      },
    );
  };

  let title = labels.title;
  let subtitle: string | undefined = labels.subtitle;
  if (isSuccess) {
    title = labels.successTitle;
    subtitle = undefined;
  }

  return (
    <>
      {children && (
        <div ref={internalTriggerRef} id={id}>
          {children}
        </div>
      )}

      {/* The Popover is the dialog: it moves the focus inside and keeps it
          there, as long as its content has no role="dialog" of its own. */}
      <Popover
        aria-labelledby={titleId}
        triggerRef={triggerRef}
        isOpen={isOpen}
        placement={placement}
        shouldFlip={shouldFlip}
        onOpenChange={(open) => {
          if (open) {
            onOpenChange?.(true);
            return;
          }
          handleClose();
        }}
        shouldCloseOnInteractOutside={(element) => {
          const popover = element.closest(".react-aria-Popover");
          if (popover) return false;
          return true;
        }}
      >
        <div className={classNames("c__generic-support-form", className)}>
          <SupportFormHeader
            titleId={titleId}
            title={title}
            subtitle={subtitle}
            closeLabel={t("components.genericSupportForm.closeAriaLabel")}
            onClose={handleClose}
            isBusy={isBusy}
          />

          {isSuccess && (
            <SupportFormSuccess
              text={labels.successText}
              closeLabel={labels.successClose}
              onClose={handleSuccessClose}
              closeRef={successCloseRef}
            />
          )}

          {!isSuccess && (
            <form
              className="c__generic-support-form__form"
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="c__generic-support-form__body">
                {categories && categories.length > 0 && (
                  <SupportFormCategory
                    label={labels.category}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelect={setSelectedCategory}
                  />
                )}

                <Input
                  ref={subjectRef}
                  label={labels.subject}
                  placeholder={labels.subjectPlaceholder}
                  variant="classic"
                  value={subject}
                  onChange={(e) =>
                    setSubject((e.target as HTMLInputElement).value)
                  }
                  required
                  aria-invalid={!!subjectError}
                  state={getFieldState(subjectError)}
                  text={subjectError}
                  fullWidth
                />

                <div className="c__generic-support-form__message">
                  <TextArea
                    ref={messageRef}
                    label={labels.message}
                    placeholder={labels.messagePlaceholder}
                    value={message}
                    rows={5}
                    variant="classic"
                    onChange={(e) =>
                      setMessage((e.target as HTMLTextAreaElement).value)
                    }
                    required
                    aria-invalid={!!messageError}
                    state={getFieldState(messageError)}
                    text={messageError}
                    fullWidth
                  />
                </div>

                <SupportFormAttachments
                  labels={labels}
                  hintId={`${id}-upload-hint`}
                  maxFiles={maxFiles}
                  acceptedFileTypes={acceptedFileTypes}
                  attachments={attachments}
                />
              </div>

              {(showReplyCheckbox || asksEmail) && (
                <SupportFormEmail
                  labels={labels}
                  showReplyCheckbox={showReplyCheckbox}
                  wantsReply={wantsReply}
                  onWantsReplyChange={setWantsReply}
                  asksEmail={asksEmail}
                  email={email}
                  onEmailChange={setEmail}
                  onEmailBlur={() => setEmailTouched(true)}
                  emailState={emailState}
                  emailError={emailError}
                  emailRef={emailRef}
                  privacyUrl={emailPrivacyUrl}
                  collectsEmail={collectsEmail}
                />
              )}

              {sendError && (
                <p
                  className="c__generic-support-form__error c__generic-support-form__error--send"
                  role="alert"
                >
                  {sendError}
                </p>
              )}

              <SupportFormFooter
                labels={labels}
                onCancel={handleCancel}
                isBusy={isBusy}
              />
            </form>
          )}
        </div>
      </Popover>
    </>
  );
};
