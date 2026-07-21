import { useCallback, useId, useMemo, useRef, useState } from "react";
import { Popover } from "react-aria-components";
import {
  Button,
  Input,
  Checkbox,
  TextArea,
  useCunningham,
} from "@gouvfr-lasuite/cunningham-react";
import { DropdownMenu } from "../dropdown-menu/DropdownMenu";
import { useDropdownMenu } from "../dropdown-menu/useDropdownMenu";
import { DropdownMenuOption } from "../dropdown-menu/types";
import { FeedbackFormLabels, FeedbackFormProps } from "./types";

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

export const FeedbackForm = ({
  categories,
  defaultCategory,
  showEmailReply = true,
  onSend,
  onCancel,
  isOpen = false,
  onOpenChange,
  labels: labelsOverride,
  emailPrivacyUrl,
  maxFileSize,
  acceptedFileTypes,
  isSending = false,
  className,
  placement = "bottom",
  shouldFlip,
  triggerRef: externalTriggerRef,
  children,
}: FeedbackFormProps) => {
  const { t } = useCunningham();
  const id = useId();
  const internalTriggerRef = useRef<HTMLDivElement>(null);
  const triggerRef = externalTriggerRef || internalTriggerRef;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const labels = useMemo<FeedbackFormLabels>(
    () => ({
      title: labelsOverride?.title ?? t("components.feedbackForm.title"),
      subtitle: labelsOverride?.subtitle ?? t("components.feedbackForm.subtitle"),
      subject: labelsOverride?.subject ?? t("components.feedbackForm.subject"),
      subjectPlaceholder: labelsOverride?.subjectPlaceholder ?? t("components.feedbackForm.subjectPlaceholder"),
      message: labelsOverride?.message ?? t("components.feedbackForm.message"),
      messagePlaceholder: labelsOverride?.messagePlaceholder ?? t("components.feedbackForm.messagePlaceholder"),
      uploadFile: labelsOverride?.uploadFile ?? t("components.feedbackForm.uploadFile"),
      emailCheckbox: labelsOverride?.emailCheckbox ?? t("components.feedbackForm.emailCheckbox"),
      emailLabel: labelsOverride?.emailLabel ?? t("components.feedbackForm.emailLabel"),
      emailPrivacy: labelsOverride?.emailPrivacy ?? t("components.feedbackForm.emailPrivacy"),
      emailError: labelsOverride?.emailError ?? t("components.feedbackForm.emailError"),
      cancel: labelsOverride?.cancel ?? t("components.feedbackForm.cancel"),
      send: labelsOverride?.send ?? t("components.feedbackForm.send"),
      category: labelsOverride?.category ?? t("components.feedbackForm.category"),
    }),
    [labelsOverride, t],
  );

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [wantsReply, setWantsReply] = useState(false);
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
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

  const emailValid = isValidEmail(email);
  const canSend =
    subject.trim().length > 0 &&
    message.trim().length > 0 &&
    (!wantsReply || emailValid);

  const handleClose = useCallback(() => {
    onOpenChange?.(false);
    onCancel?.();
  }, [onOpenChange, onCancel]);

  const handleSend = useCallback(() => {
    if (!canSend || isSending) return;
    onSend({
      category: selectedCategory,
      subject: subject.trim(),
      message: message.trim(),
      files: files.length > 0 ? files : undefined,
      email: wantsReply ? email.trim() : undefined,
    });
  }, [
    canSend,
    isSending,
    onSend,
    selectedCategory,
    subject,
    message,
    files,
    wantsReply,
    email,
  ]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files || []);
      const filtered = newFiles.filter((file) => {
        if (maxFileSize && file.size > maxFileSize) return false;
        if (acceptedFileTypes?.length && !acceptedFileTypes.includes(file.type))
          return false;
        return true;
      });
      setFiles((prev) => [...prev, ...filtered]);
      e.target.value = "";
    },
    [maxFileSize, acceptedFileTypes],
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const emailState = emailTouched
    ? emailValid
      ? "success"
      : "error"
    : "default";

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
            handleClose();
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
        <div className={`c__feedback-form${className ? ` ${className}` : ""}`}>
          {/* Header */}
          <div className="c__feedback-form__header">
            <div className="c__feedback-form__header__text">
              <h3 className="c__feedback-form__title">{labels.title}</h3>
              <p className="c__feedback-form__subtitle">{labels.subtitle}</p>
            </div>
            <Button
              className="c__feedback-form__close"
              color="neutral"
              variant="tertiary"
              size="small"
              icon={<span className="material-icons">close</span>}
              onClick={handleClose}
              aria-label={t("components.feedbackForm.closeAriaLabel")}
            />
          </div>

          {/* Body */}
          <div className="c__feedback-form__body">
            {/* Category */}
            {categories && categories.length > 0 && (
              <div className="c__feedback-form__category">
                <span className="c__feedback-form__category__label">
                  {labels.category}
                </span>
                <DropdownMenu
                  options={categories}
                  isOpen={categoryMenu.isOpen}
                  onOpenChange={categoryMenu.setIsOpen}
                  selectedValues={selectedCategory ? [selectedCategory] : []}
                  onSelectValue={(value) => setSelectedCategory(value)}
                >
                  <button
                    type="button"
                    className="c__feedback-form__category__trigger"
                    onClick={() => categoryMenu.setIsOpen(!categoryMenu.isOpen)}
                  >
                    {selectedCategoryItem?.icon && (
                      <span className="c__feedback-form__category__trigger__icon">
                        {selectedCategoryItem.icon}
                      </span>
                    )}
                    <span className="c__feedback-form__category__trigger__label">
                      {selectedCategoryItem?.label || labels.category}
                    </span>
                    <span className="material-icons c__feedback-form__category__trigger__chevron">
                      arrow_drop_down
                    </span>
                  </button>
                </DropdownMenu>
              </div>
            )}

            {/* Subject */}
            <Input
              label={labels.subject}
              placeholder={labels.subjectPlaceholder}
              variant="classic"
              value={subject}
              onChange={(e) => setSubject((e.target as HTMLInputElement).value)}
              fullWidth
            />

            {/* Message */}
            <div className="c__feedback-form__message">
              <TextArea
                label={labels.message}
                placeholder={labels.messagePlaceholder}
                value={message}
                rows={5}
                variant="classic"
                onChange={(e) =>
                  setMessage((e.target as HTMLTextAreaElement).value)
                }
                fullWidth
              />
            </div>

            {/* Files */}
            <div className="c__feedback-form__files">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="c__feedback-form__files__chip"
                >
                  <span className="c__feedback-form__files__chip__name">
                    {truncateFileName(file.name)}
                  </span>
                  <button
                    type="button"
                    className="c__feedback-form__files__chip__remove"
                    onClick={() => removeFile(index)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <span className="material-icons">close</span>
                  </button>
                </div>
              ))}
              <Button
                color="neutral"
                variant="bordered"
                size="nano"
                icon={<span className="material-icons">upload</span>}
                onClick={() => fileInputRef.current?.click()}
              >
                <span>{labels.uploadFile}</span>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={acceptedFileTypes?.join(",")}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* Email section */}
          {showEmailReply && (
            <div className="c__feedback-form__email-section">
              <Checkbox
                label={labels.emailCheckbox}
                checked={wantsReply}
                onChange={(e) =>
                  setWantsReply((e.target as HTMLInputElement).checked)
                }
              />
              {wantsReply && (
                <Input
                  label={labels.emailLabel}
                  value={email}
                  variant="classic"
                  onChange={(e) =>
                    setEmail((e.target as HTMLInputElement).value)
                  }
                  onBlur={() => setEmailTouched(true)}
                  state={emailState as "success" | "error" | "default"}
                  aria-invalid={emailState === "error"}
                  text={emailState === "error" ? labels.emailError : undefined}
                  rightIcon={
                    emailState === "success" ? (
                      <span className="material-icons">check_circle</span>
                    ) : emailState === "error" ? (
                      <span className="material-icons">error</span>
                    ) : undefined
                  }
                  fullWidth
                />
              )}
              {wantsReply && emailPrivacyUrl && (
                <a
                  href={emailPrivacyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="c__feedback-form__email-section__privacy"
                >
                  {labels.emailPrivacy}
                </a>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="c__feedback-form__footer">
            <Button
              color="brand"
              variant="bordered"
              onClick={handleClose}
              fullWidth
            >
              {labels.cancel}
            </Button>
            <Button
              color="brand"
              disabled={!canSend || isSending}
              onClick={handleSend}
              fullWidth
            >
              {labels.send}
            </Button>
          </div>
        </div>
      </Popover>
    </>
  );
};
