import clsx from "clsx";
import { DragEvent, useRef, useState } from "react";
import { Button, useCunningham } from "@gouvfr-lasuite/cunningham-react";
import { Spinner } from ":/components/loader/Spinner";
import { FileIcon as PreviewFileIcon } from ":/components/preview/icons/FileIcon";
import filesColor from "./assets/files_color.svg";
import filesGray from "./assets/files_gray.svg";
import { UploadFileItem } from "./UploadFileItem";
import { ResolvedUploadLabels, UploadFile, UploadFileLabels } from "./types";
import { formatBytes } from "./utils";
export type FileUploaderProps = {
  /** Name forwarded to the underlying file input. */
  name?: string;
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
  /** Called with the next controlled files after a selection or drop. */
  onAddFiles?: (files: UploadFile[]) => void;
  /** Called when a file's remove control is activated. */
  onRemoveFile?: (file: UploadFile) => void;
  /** Called when an uploading file's cancel control is activated. */
  onCancelFile?: (file: UploadFile) => void;
  /** Override any of the default (translated) labels. */
  labels?: UploadFileLabels;
  className?: string;
  /** Displayed when a file is selected in the dropzone. */
  description?: string;
  /** Visual tone of the description text. */
  descriptionMode?: "default" | "error";
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
  name,
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
  description,
  descriptionMode = "default",
}: FileUploaderProps) => {
  const { t } = useCunningham();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const l: ResolvedUploadLabels = {
    noFileYet: labels?.noFileYet ?? t("components.upload.noFileYet"),
    clickToUpload:
      labels?.clickToUpload ?? t("components.upload.clickToUpload"),
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

    const addedFiles: UploadFile[] = Array.from(fileList, (originalFile) => ({
      id: crypto.randomUUID(),
      originalFile,
      status: "pending",
    }));

    onAddFiles?.(multiple ? [...files, ...addedFiles] : addedFiles.slice(0, 1));
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    // Moving over a child of the dropzone also fires dragleave; only clear
    // the dragging state when the cursor actually exits the dropzone.
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }
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
  const singleFileStatus = singleFile?.status ?? "done";
  const dropzoneIsFile = !!singleFile && singleFileStatus !== "error";

  const hasError = !!singleFile && singleFileStatus === "error";

  const renderIllustration = () => (
    <div className="c__file-uploader__illustration" aria-hidden="true">
      <img src={isDragging ? filesColor : filesGray} alt="" draggable="false" />
    </div>
  );

  const renderPrompt = () => (
    <div className="c__file-uploader__dropzone__inner">
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
    </div>
  );

  const renderSingleFile = (file: UploadFile) => {
    const { name: fileName, type } = file.originalFile;

    if (file.status === "uploading") {
      return (
        <div className="c__file-uploader__dropzone__inner">
          <span
            className="c__file-uploader__dropzone__loader"
            data-testid="file-uploader-loader"
          >
            <Spinner size="md" />
          </span>
          <p className="c__file-uploader__dropzone__text c__file-uploader__dropzone__text--uploading">
            {fileName} – {l.uploading}
          </p>
          {onCancelFile && (
            <Button
              type="button"
              variant="tertiary"
              color="error"
              size="nano"
              className="c__file-uploader__button"
              onClick={(e) => {
                e.stopPropagation();
                onCancelFile(file);
              }}
            >
              {l.cancel}
            </Button>
          )}
        </div>
      );
    }
    return (
      <div className="c__file-uploader__dropzone__inner">
        <span className="c__file-uploader__dropzone__file-icon">
          {file.status === "error" ? (
            <ErrorIcon />
          ) : (
            <PreviewFileIcon
              file={{ title: fileName, mimetype: type }}
              size={48}
            />
          )}
        </span>
        <p className="c__file-uploader__dropzone__text">{fileName}</p>
        {file.status === "error" ? (
          <p className="c__file-uploader__dropzone__error">
            {file.error ?? l.genericError}
          </p>
        ) : description ? (
          <p
            className={clsx("c__file-uploader__dropzone__description", {
              "c__file-uploader__dropzone__description--error":
                descriptionMode === "error",
            })}
          >
            {description}
          </p>
        ) : null}
        {onRemoveFile && (
          <Button
            type="button"
            variant="tertiary"
            color="neutral"
            size="nano"
            className="c__file-uploader__button"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFile(file);
            }}
          >
            {l.remove}
          </Button>
        )}
      </div>
    );
  };

  const renderInner = () => {
    if (multiple && files.length > 0) {
      return (
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
      );
    }

    if (isDragging) {
      return (
        <>
          {renderIllustration()}
          <p className="c__file-uploader__dropzone__drag-label">{l.addFile}</p>
        </>
      );
    }

    if ((hasError || dropzoneIsFile) && singleFile) {
      return renderSingleFile(singleFile);
    }

    return renderPrompt();
  };

  return (
    <div className={clsx("c__file-uploader", className)}>
      <input
        ref={inputRef}
        name={name}
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
        {renderInner()}
      </div>
    </div>
  );
};

/**
 * Component-specific error icon.
 */
const ErrorIcon = () => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.2">
        <circle
          cx="20"
          cy="20"
          r="10"
          stroke="currentColor"
          strokeWidth="2.22222"
        />
        <circle
          cx="20"
          cy="20"
          r="10"
          stroke="url(#paint0_linear_15467_2649)"
          strokeOpacity="0.35"
          strokeWidth="2.22222"
        />
      </g>
      <path
        d="M20.0098 23C20.562 23 21.0097 23.4478 21.0098 24C21.0098 24.5523 20.5621 25 20.0098 25H20C19.4478 24.9999 19 24.5523 19 24C19.0001 23.4478 19.4478 23.0001 20 23H20.0098ZM20 15C20.5523 15 21 15.4477 21 16V20C20.9999 20.5522 20.5522 21 20 21C19.4478 20.9999 19.0001 20.5522 19 20V16C19 15.4477 19.4478 15.0001 20 15Z"
        fill="currentColor"
      />
      <path
        d="M20.0098 23C20.562 23 21.0097 23.4478 21.0098 24C21.0098 24.5523 20.5621 25 20.0098 25H20C19.4478 24.9999 19 24.5523 19 24C19.0001 23.4478 19.4478 23.0001 20 23H20.0098ZM20 15C20.5523 15 21 15.4477 21 16V20C20.9999 20.5522 20.5522 21 20 21C19.4478 20.9999 19.0001 20.5522 19 20V16C19 15.4477 19.4478 15.0001 20 15Z"
        fill="url(#paint1_linear_15467_2649)"
        fillOpacity="0.12"
      />
      <defs>
        <linearGradient
          id="paint0_linear_15467_2649"
          x1="20"
          y1="20"
          x2="19.9999"
          y2="30.0173"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_15467_2649"
          x1="20.0049"
          y1="20.7759"
          x2="20.0049"
          y2="25.0086"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  );
};
