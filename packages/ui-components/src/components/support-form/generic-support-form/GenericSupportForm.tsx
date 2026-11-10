import {
  FormEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Popover } from "react-aria-components";
import { Button, Input, Checkbox, TextArea } from ":/cunningham";
import type { ButtonElement } from ":/components/button";
import { useCunningham } from ":/components/provider";
import { Spinner } from ":/components/loader/Spinner";
import { BubbleText } from ":/icons";
import { IconSize } from "../../icon";
import { DropdownMenu } from "../../dropdown-menu/DropdownMenu";
import { useDropdownMenu } from "../../dropdown-menu/useDropdownMenu";
import { DropdownMenuOption } from "../../dropdown-menu/types";
import { GenericSupportFormLabels, GenericSupportFormProps } from "./types";

// Labels that have a default translation under `components.genericSupportForm`.
// `uploadHint` is left out on purpose: it depends on the app's file rules.
const TRANSLATED_LABELS = [
  "title",
  "subtitle",
  "subject",
  "subjectPlaceholder",
  "subjectRequired",
  "message",
  "messagePlaceholder",
  "messageRequired",
  "uploadFile",
  "removeFile",
  "fileTooLarge",
  "fileTypeInvalid",
  "fileTooMany",
  "emailCheckbox",
  "emailLabel",
  "emailPrivacy",
  "emailRequired",
  "emailError",
  "cancel",
  "send",
  "sending",
  "category",
  "error",
  "successTitle",
  "successText",
  "successClose",
] as const satisfies readonly (keyof GenericSupportFormLabels)[];

type SendStatus = "idle" | "sending" | "success";

const isValidEmail = (email: string) => {
  return !!email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z\-0-9]{2,}))$/,
  );
};

const truncateFileName = (name: string, maxLength = 15) => {
  if (name.length <= maxLength) return name;
  const ext = name.lastIndexOf(".");
  if (ext > 0) {
    const extension = name.slice(ext);
    const base = name.slice(0, maxLength - extension.length - 3);
    return `${base}...${extension}`;
  }
  return `${name.slice(0, maxLength - 3)}...`;
};

/** Accepts MIME types (`image/png`), wildcards (`image/*`) and extensions (`.txt`). */
const isAcceptedType = (file: File, acceptedTypes: string[]) => {
  const mimeType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  return acceptedTypes.some((acceptedType) => {
    const type = acceptedType.trim().toLowerCase();
    if (type.startsWith(".")) return fileName.endsWith(type);
    if (type.endsWith("/*")) return mimeType.startsWith(type.slice(0, -1));
    return mimeType === type;
  });
};

const isPromiseLike = (value: unknown): value is PromiseLike<unknown> =>
  typeof (value as PromiseLike<unknown> | null)?.then === "function";

const formatFileSize = (bytes: number, locale: string) => {
  const megabytes = bytes / (1024 * 1024);
  const [value, unit] =
    megabytes >= 1 ? [megabytes, "megabyte"] : [bytes / 1024, "kilobyte"];
  try {
    return new Intl.NumberFormat(locale, {
      style: "unit",
      unit,
      maximumFractionDigits: 1,
    }).format(value);
  } catch {
    return `${Math.round(value * 10) / 10} ${unit === "megabyte" ? "MB" : "KB"}`;
  }
};

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
  const { t, currentLocale } = useCunningham();
  const id = useId();
  const titleId = `${id}-title`;
  const uploadHintId = `${id}-upload-hint`;
  const internalTriggerRef = useRef<HTMLDivElement>(null);
  const triggerRef = externalTriggerRef || internalTriggerRef;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const successCloseRef = useRef<ButtonElement>(null);
  // Each send gets a number, so a late answer to an old send is ignored.
  const sendAttemptRef = useRef(0);

  const labels = useMemo<GenericSupportFormLabels>(() => {
    const resolved = {
      uploadHint: labelsOverride?.uploadHint,
    } as GenericSupportFormLabels;
    for (const key of TRANSLATED_LABELS) {
      resolved[key] =
        labelsOverride?.[key] ?? t(`components.genericSupportForm.${key}`);
    }
    return resolved;
  }, [labelsOverride, t]);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>();
  const [wantsReply, setWantsReply] = useState(false);
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<SendStatus>("idle");
  const [sendError, setSendError] = useState<string>();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    defaultCategory,
  );

  const categoryMenu = useDropdownMenu();

  const selectedCategoryItem = useMemo(() => {
    if (!categories || !selectedCategory) return undefined;
    return categories.find(
      (item) => "value" in item && item.value === selectedCategory,
    ) as DropdownMenuOption | undefined;
  }, [categories, selectedCategory]);

  const knownEmail =
    knownEmailProp && isValidEmail(knownEmailProp.trim())
      ? knownEmailProp.trim()
      : undefined;
  const showReplyCheckbox = !requireEmail && showEmailReply;
  const collectsEmail = requireEmail || (showReplyCheckbox && wantsReply);
  const asksEmail = collectsEmail && !knownEmail;
  const isBusy = isSending || status === "sending";

  const subjectError =
    submitted && !subject.trim() ? labels.subjectRequired : undefined;
  const messageError =
    submitted && !message.trim() ? labels.messageRequired : undefined;
  const emailProblem = !asksEmail
    ? undefined
    : !email.trim()
      ? labels.emailRequired
      : !isValidEmail(email.trim())
        ? labels.emailError
        : undefined;
  const emailChecked = submitted || emailTouched;
  const emailError = emailChecked ? emailProblem : undefined;
  const emailState = !emailChecked
    ? "default"
    : emailError
      ? "error"
      : "success";

  const resetForm = useCallback(() => {
    // Ignore the answer of a send started before the reset.
    sendAttemptRef.current++;
    setSubject("");
    setMessage("");
    setFiles([]);
    setFileError(undefined);
    setWantsReply(false);
    setEmail("");
    setEmailTouched(false);
    setSubmitted(false);
    setStatus("idle");
    setSendError(undefined);
    setSelectedCategory(defaultCategory);
  }, [defaultCategory]);

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
        setFileError(undefined);
      }
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, status, resetForm]);

  // The Send button disappears with the success view: move focus to Close.
  useEffect(() => {
    if (status === "success") {
      successCloseRef.current?.focus();
    }
  }, [status]);

  const close = useCallback(() => {
    onOpenChange?.(false);
    onCancel?.();
  }, [onOpenChange, onCancel]);

  const handleCancel = useCallback(() => {
    // A request already sent can't be taken back: Cancel waits for its result.
    if (isBusy) return;
    resetForm();
    close();
  }, [isBusy, resetForm, close]);

  const handleSuccessClose = useCallback(() => {
    onOpenChange?.(false);
    onSuccessClose?.();
  }, [onOpenChange, onSuccessClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isBusy) return;
    setSubmitted(true);
    setSendError(undefined);

    // Move focus to the first invalid field, so screen reader and keyboard
    // users land on the error.
    const firstInvalid = !subject.trim()
      ? subjectRef.current
      : !message.trim()
        ? messageRef.current
        : emailProblem
          ? emailRef.current
          : null;
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const result = onSend({
      category: selectedCategory,
      subject: subject.trim(),
      message: message.trim(),
      files: files.length > 0 ? files : undefined,
      email: collectsEmail ? (knownEmail ?? email.trim()) : undefined,
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
        setSendError(
          error instanceof Error && error.message
            ? error.message
            : labels.error,
        );
      },
    );
  };

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const incoming = Array.from(e.target.files || []);
      e.target.value = "";
      const accepted: File[] = [];
      let error: string | undefined;
      for (const file of incoming) {
        if (
          maxFiles !== undefined &&
          files.length + accepted.length >= maxFiles
        ) {
          error = labels.fileTooMany.replace("{max}", String(maxFiles));
          break;
        }
        if (
          acceptedFileTypes?.length &&
          !isAcceptedType(file, acceptedFileTypes)
        ) {
          error = labels.fileTypeInvalid;
          continue;
        }
        if (maxFileSize && file.size > maxFileSize) {
          error = labels.fileTooLarge.replace(
            "{size}",
            formatFileSize(maxFileSize, currentLocale),
          );
          continue;
        }
        accepted.push(file);
      }
      setFiles((prev) => [...prev, ...accepted]);
      setFileError(error);
    },
    [
      files.length,
      maxFiles,
      maxFileSize,
      acceptedFileTypes,
      labels,
      currentLocale,
    ],
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError(undefined);
  }, []);

  return (
    <>
      {children && (
        <div ref={internalTriggerRef} id={id}>
          {children}
        </div>
      )}

      <Popover
        triggerRef={triggerRef}
        isOpen={isOpen}
        placement={placement}
        shouldFlip={shouldFlip}
        onOpenChange={(open) => {
          if (!open) {
            // Escape or a click outside: after a send, it closes the success
            // view, not a draft.
            if (status === "success") handleSuccessClose();
            else close();
          } else {
            onOpenChange?.(true);
          }
        }}
        shouldCloseOnInteractOutside={(element) => {
          const popover = element.closest(".react-aria-Popover");
          if (popover) return false;
          return true;
        }}
      >
        <div
          className={`c__generic-support-form${className ? ` ${className}` : ""}`}
          role="dialog"
          aria-labelledby={titleId}
        >
          {/* Header */}
          <div className="c__generic-support-form__header">
            <div className="c__generic-support-form__header__text">
              <h3 className="c__generic-support-form__title" id={titleId}>
                {status === "success" ? labels.successTitle : labels.title}
              </h3>
              {status !== "success" && (
                <p className="c__generic-support-form__subtitle">
                  {labels.subtitle}
                </p>
              )}
            </div>
            <Button
              type="button"
              className="c__generic-support-form__close"
              color="neutral"
              variant="tertiary"
              size="small"
              icon={
                <span className="material-icons" aria-hidden="true">
                  close
                </span>
              }
              onClick={status === "success" ? handleSuccessClose : close}
              aria-label={t("components.genericSupportForm.closeAriaLabel")}
            />
          </div>

          {status === "success" ? (
            <div className="c__generic-support-form__success">
              <BubbleText
                size={IconSize.X_LARGE}
                className="c__generic-support-form__success__icon"
                aria-hidden="true"
              />
              <p className="c__generic-support-form__success__text">
                {labels.successText}
              </p>
              <Button
                ref={successCloseRef}
                type="button"
                color="brand"
                variant="secondary"
                onClick={handleSuccessClose}
                fullWidth
              >
                {labels.successClose}
              </Button>
            </div>
          ) : (
            <form
              className="c__generic-support-form__form"
              noValidate
              onSubmit={handleSubmit}
            >
              {/* Body */}
              <div className="c__generic-support-form__body">
                {/* Category */}
                {categories && categories.length > 0 && (
                  <div className="c__generic-support-form__category">
                    <span className="c__generic-support-form__category__label">
                      {labels.category}
                    </span>
                    <DropdownMenu
                      options={categories}
                      isOpen={categoryMenu.isOpen}
                      onOpenChange={categoryMenu.setIsOpen}
                      selectedValues={
                        selectedCategory ? [selectedCategory] : []
                      }
                      onSelectValue={(value) => setSelectedCategory(value)}
                    >
                      <button
                        type="button"
                        className="c__generic-support-form__category__trigger"
                        onClick={() =>
                          categoryMenu.setIsOpen(!categoryMenu.isOpen)
                        }
                      >
                        {selectedCategoryItem?.icon && (
                          <span className="c__generic-support-form__category__trigger__icon">
                            {selectedCategoryItem.icon}
                          </span>
                        )}
                        <span className="c__generic-support-form__category__trigger__label">
                          {selectedCategoryItem?.label || labels.category}
                        </span>
                        <span
                          className="material-icons c__generic-support-form__category__trigger__chevron"
                          aria-hidden="true"
                        >
                          arrow_drop_down
                        </span>
                      </button>
                    </DropdownMenu>
                  </div>
                )}

                {/* Subject */}
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
                  state={subjectError ? "error" : "default"}
                  text={subjectError}
                  fullWidth
                />

                {/* Message */}
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
                    state={messageError ? "error" : "default"}
                    text={messageError}
                    fullWidth
                  />
                </div>

                {/* Files */}
                <div className="c__generic-support-form__files">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="c__generic-support-form__files__chip"
                    >
                      <span className="c__generic-support-form__files__chip__name">
                        {truncateFileName(file.name)}
                      </span>
                      <button
                        type="button"
                        className="c__generic-support-form__files__chip__remove"
                        onClick={() => removeFile(index)}
                        aria-label={labels.removeFile.replace(
                          "{name}",
                          file.name,
                        )}
                      >
                        <span className="material-icons" aria-hidden="true">
                          close
                        </span>
                      </button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    color="neutral"
                    variant="bordered"
                    size="nano"
                    icon={
                      <span className="material-icons" aria-hidden="true">
                        upload
                      </span>
                    }
                    onClick={() => fileInputRef.current?.click()}
                    aria-describedby={
                      labels.uploadHint ? uploadHintId : undefined
                    }
                  >
                    <span>{labels.uploadFile}</span>
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple={maxFiles !== 1}
                    accept={acceptedFileTypes?.join(",")}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div>
                {labels.uploadHint && (
                  <p
                    className="c__generic-support-form__hint"
                    id={uploadHintId}
                  >
                    {labels.uploadHint}
                  </p>
                )}
                {fileError && (
                  <p className="c__generic-support-form__error" role="alert">
                    {fileError}
                  </p>
                )}
              </div>

              {/* Email section */}
              {(showReplyCheckbox || asksEmail) && (
                <div className="c__generic-support-form__email-section">
                  {showReplyCheckbox && (
                    <Checkbox
                      label={labels.emailCheckbox}
                      checked={wantsReply}
                      onChange={(e) =>
                        setWantsReply((e.target as HTMLInputElement).checked)
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
                      onChange={(e) =>
                        setEmail((e.target as HTMLInputElement).value)
                      }
                      onBlur={() => setEmailTouched(true)}
                      required
                      state={emailState}
                      aria-invalid={emailState === "error"}
                      text={emailError}
                      rightIcon={
                        emailState === "success" ? (
                          <span className="material-icons" aria-hidden="true">
                            check_circle
                          </span>
                        ) : emailState === "error" ? (
                          <span className="material-icons" aria-hidden="true">
                            error
                          </span>
                        ) : undefined
                      }
                      fullWidth
                    />
                  )}
                  {collectsEmail && emailPrivacyUrl && (
                    <a
                      href={emailPrivacyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="c__generic-support-form__email-section__privacy"
                    >
                      {labels.emailPrivacy}
                    </a>
                  )}
                </div>
              )}

              {sendError && (
                <p
                  className="c__generic-support-form__error c__generic-support-form__error--send"
                  role="alert"
                >
                  {sendError}
                </p>
              )}

              {/* Footer */}
              <div className="c__generic-support-form__footer">
                <Button
                  type="button"
                  color="brand"
                  variant="bordered"
                  onClick={handleCancel}
                  aria-disabled={isBusy}
                  fullWidth
                >
                  {labels.cancel}
                </Button>
                <Button
                  type="submit"
                  color="brand"
                  aria-disabled={isBusy}
                  icon={isBusy ? <Spinner size="sm" /> : undefined}
                  fullWidth
                >
                  {isBusy ? labels.sending : labels.send}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Popover>
    </>
  );
};
