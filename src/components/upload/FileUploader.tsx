import clsx from "clsx";
import { DragEvent, useRef, useState } from "react";
import { useCunningham } from "@gouvfr-lasuite/cunningham-react";
import { Icon } from ":/components/icon";
import { Spinner } from ":/components/loader/Spinner";
import { FileIcon as PreviewFileIcon } from ":/components/preview/icons/FileIcon";
import { UploadFileItem } from "./UploadFileItem";
import { ResolvedUploadLabels, UploadFile, UploadFileLabels } from "./types";
import { formatBytes } from "./utils";

export type FileUploaderProps = {
  /** Files currently tracked by the uploader (controlled). */
  files?: UploadFile[];
  /**
   * Allow several files. In single mode the dropzone displays the file state
   * itself; in multiple mode the dropzone stays available and files are listed
   * below.
   */
  multiple?: boolean;
  /** `accept` attribute forwarded to the underlying file input. */
  accept?: string;
  /** Maximum size in bytes, used for the "Max …" hint. */
  maxSize?: number;
  /** Disable the uploader. */
  disabled?: boolean;
  /** Called with the newly selected/dropped files. */
  onAddFiles?: (files: File[]) => void;
  /** Called when a file's remove control is activated. */
  onRemoveFile?: (file: UploadFile) => void;
  /** Called when an uploading file's cancel control is activated. */
  onCancelFile?: (file: UploadFile) => void;
  /** Override any of the default (translated) labels. */
  labels?: UploadFileLabels;
  className?: string;
};

/**
 * Reusable upload module with drag-and-drop and click-to-upload support.
 *
 * - Single mode (`multiple={false}`, the default): the dropzone shows the
 *   selected file and its state (uploading / done / error), replacing the
 *   prompt.
 * - Multiple mode (`multiple`): the dropzone stays available and the selected
 *   files are displayed in a list below it.
 */
export const FileUploader = ({
  files = [],
  multiple = false,
  accept,
  maxSize,
  disabled = false,
  onAddFiles,
  onRemoveFile,
  onCancelFile,
  labels,
  className,
}: FileUploaderProps) => {
  const { t } = useCunningham();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const l: ResolvedUploadLabels = {
    noFileYet: labels?.noFileYet ?? t("components.upload.noFileYet"),
    clickToUpload: labels?.clickToUpload ?? t("components.upload.clickToUpload"),
    dragAndDrop: labels?.dragAndDrop ?? t("components.upload.dragAndDrop"),
    addFile: labels?.addFile ?? t("components.upload.addFile"),
    uploading: labels?.uploading ?? t("components.upload.uploading"),
    cancel: labels?.cancel ?? t("components.upload.cancel"),
    remove: labels?.remove ?? t("components.upload.remove"),
    genericError: labels?.genericError ?? t("components.upload.genericError"),
    maxSize:
      labels?.maxSize ??
      (maxSize !== undefined
        ? t("components.upload.maxSize", { size: formatBytes(maxSize) })
        : undefined),
  };

  const singleFile = !multiple ? files[0] : undefined;

  const openFileDialog = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const emitFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      return;
    }
    onAddFiles?.(Array.from(fileList));
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (!disabled) {
      emitFiles(event.dataTransfer.files);
    }
  };

  // Whether the dropzone itself is acting as the file representation.
  const dropzoneIsFile =
    !!singleFile &&
    (singleFile.status === "uploading" ||
      singleFile.status === "done" ||
      singleFile.status === "pending");

  const hasError = !!singleFile && singleFile.status === "error";

  const renderIllustration = () => (
    <div className="c__file-uploader__illustration" aria-hidden="true">
      <span className="c__file-uploader__illustration__file c__file-uploader__illustration__file--doc">
        <PreviewFileIcon
          file={{
            title: "document.docx",
            mimetype:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          }}
          size={42}
        />
      </span>
      <span className="c__file-uploader__illustration__file c__file-uploader__illustration__file--slide">
        <PreviewFileIcon
          file={{
            title: "presentation.pptx",
            mimetype:
              "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          }}
          size={42}
        />
      </span>
      <span className="c__file-uploader__illustration__file c__file-uploader__illustration__file--image">
        <PreviewFileIcon
          file={{ title: "wallpaper.png", mimetype: "image/png" }}
          size={54}
        />
      </span>
    </div>
  );

  const renderPrompt = () => (
    <>
      {renderIllustration()}
      <p className="c__file-uploader__dropzone__hint">
        <span>{l.noFileYet}</span>
        {l.maxSize && (
          <>
            <span>&nbsp;-&nbsp;</span>
            <span>{l.maxSize}</span>
          </>
        )}
      </p>
      <span className="c__file-uploader__link c__file-uploader__link--brand">
        {multiple && files.length > 0 ? l.addFile : l.clickToUpload}
      </span>
    </>
  );

  const renderSingleFile = (file: UploadFile) => {
    if (file.status === "uploading") {
      return (
        <>
          <Spinner size="md" />
          <p className="c__file-uploader__dropzone__text">
            {file.name} – {l.uploading}
          </p>
          {onCancelFile && (
            <button
              type="button"
              className="c__file-uploader__link c__file-uploader__link--danger"
              onClick={(e) => {
                e.stopPropagation();
                onCancelFile(file);
              }}
            >
              {l.cancel}
            </button>
          )}
        </>
      );
    }
    return (
      <>
        <PreviewFileIcon
          file={{ title: file.name, mimetype: file.type ?? "" }}
          size={48}
        />
        <p className="c__file-uploader__dropzone__text">
          {file.name}
        </p>
        {onRemoveFile && (
          <button
            type="button"
            className="c__file-uploader__link"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFile(file);
            }}
          >
            {l.remove}
          </button>
        )}
      </>
    );
  };

  return (
    <div className={clsx("c__file-uploader", className)}>
      <input
        ref={inputRef}
        type="file"
        className="c__file-uploader__input"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          emitFiles(e.target.files);
          // Reset so selecting the same file again re-triggers onChange.
          e.target.value = "";
        }}
      />
      <div
        className={clsx("c__file-uploader__dropzone", {
          "c__file-uploader__dropzone--dragging": isDragging,
          "c__file-uploader__dropzone--error": hasError,
          "c__file-uploader__dropzone--filled": dropzoneIsFile,
          "c__file-uploader__dropzone--multiple": multiple && files.length > 0,
          "c__file-uploader__dropzone--disabled": disabled,
        })}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={openFileDialog}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openFileDialog();
          }
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        data-testid="file-uploader-dropzone"
      >
        {multiple && files.length > 0 ? (
          <ul className="c__file-uploader__list" data-testid="file-uploader-list">
            {files.map((file) => (
              <UploadFileItem
                key={file.id}
                file={file}
                labels={l}
                onRemove={onRemoveFile}
                onCancel={onCancelFile}
              />
            ))}
          </ul>
        ) : isDragging ? (
          <>
            {renderIllustration()}
            <p className="c__file-uploader__dropzone__drag-label">
              {l.addFile}
            </p>
          </>
        ) : hasError && singleFile ? (
          <>
            <Icon
              name="error"
              className="c__file-uploader__dropzone__icon c__file-uploader__dropzone__icon--error"
            />
            <p className="c__file-uploader__dropzone__error">
              {singleFile.error ?? l.genericError}
            </p>
            {renderPrompt()}
          </>
        ) : dropzoneIsFile && singleFile ? (
          renderSingleFile(singleFile)
        ) : (
          renderPrompt()
        )}
      </div>
    </div>
  );
};
