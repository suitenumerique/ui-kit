import { useRef } from "react";
import { Button } from ":/cunningham";
import { GenericSupportFormLabels } from "./types";
import { SupportFormFiles } from "./useSupportFormFiles";
import { truncateFileName } from "./utils";

type SupportFormAttachmentsProps = {
  labels: GenericSupportFormLabels;
  /** Id of the hint under the upload button, which describes it. */
  hintId: string;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  attachments: SupportFormFiles;
};

/** The attached files as chips, the upload button, its hint and the refusals. */
export const SupportFormAttachments = ({
  labels,
  hintId,
  maxFiles,
  acceptedFileTypes,
  attachments,
}: SupportFormAttachmentsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    files,
    fileError,
    canAddFiles,
    addFiles,
    removeFile,
    uploadButtonRef,
    removeButtonsRef,
  } = attachments;
  // Hidden once maxFiles is reached: picking another file would only show an
  // error.
  const showHint = canAddFiles && !!labels.uploadHint;
  let uploadDescribedBy: string | undefined;
  if (showHint) uploadDescribedBy = hintId;

  return (
    <>
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
              ref={(element) => {
                removeButtonsRef.current[index] = element;
              }}
              type="button"
              className="c__generic-support-form__files__chip__remove"
              onClick={() => removeFile(index)}
              aria-label={labels.removeFile.replace("{name}", file.name)}
            >
              <span className="material-icons" aria-hidden="true">
                close
              </span>
            </button>
          </div>
        ))}
        {canAddFiles && (
          <>
            <Button
              ref={uploadButtonRef}
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
              aria-describedby={uploadDescribedBy}
            >
              <span>{labels.uploadFile}</span>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple={maxFiles !== 1}
              accept={acceptedFileTypes?.join(",")}
              onChange={addFiles}
              style={{ display: "none" }}
            />
          </>
        )}
      </div>
      {showHint && (
        <p className="c__generic-support-form__hint" id={hintId}>
          {labels.uploadHint}
        </p>
      )}
      {fileError && (
        <p className="c__generic-support-form__error" role="alert">
          {fileError}
        </p>
      )}
    </>
  );
};
