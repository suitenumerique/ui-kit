import clsx from "clsx";
import { Button } from "@gouvfr-lasuite/cunningham-react";
import { Icon } from ":/components/icon";
import { CircleCheckFilled } from ":/components/icon/icons/CircleCheckFilled";
import { FileIcon as PreviewFileIcon } from ":/components/preview/icons/FileIcon";
import { ResolvedUploadLabels, UploadFile } from "./types";
import { formatBytes } from "./utils";

type UploadFileItemProps = {
  file: UploadFile;
  labels: ResolvedUploadLabels;
  onRemove?: (file: UploadFile) => void;
  onCancel?: (file: UploadFile) => void;
};

const clampProgress = (progress?: number) => {
  if (progress === undefined || Number.isNaN(progress)) {
    return 0;
  }
  return Math.min(100, Math.max(0, progress));
};

/**
 * A single row in the uploaded files list, rendering the file icon, its name
 * and a trailing control/indicator that depends on the file status.
 */
export const UploadFileItem = ({
  file,
  labels,
  onRemove,
  onCancel,
}: UploadFileItemProps) => {
  const status = file.status ?? "done";
  const progress = clampProgress(file.progress);

  const renderTrailing = () => {
    if (status === "uploading") {
      return onCancel ? (
        <Button
          type="button"
          variant="tertiary"
          color="error"
          size="nano"
          className="c__file-uploader__item__cancel"
          onClick={(e) => {
            e.stopPropagation();
            onCancel(file);
          }}
        >
          {labels.cancel}
        </Button>
      ) : (
        <span
          className="c__file-uploader__item__status c__file-uploader__item__status--uploading"
          role="progressbar"
          aria-label={`${file.name} – ${labels.uploading}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <svg
            className="c__file-uploader__item__progress"
            viewBox="0 0 16 16"
            aria-hidden="true"
            focusable="false"
          >
            <circle
              cx="8"
              cy="8"
              r="7"
              pathLength={100}
              strokeDasharray={`${progress} 100`}
            />
          </svg>
        </span>
      );
    }
    if (status === "error") {
      return (
        <span
          className="c__file-uploader__item__status c__file-uploader__item__status--error"
          aria-hidden="true"
        >
          <Icon name="error" size={16} />
        </span>
      );
    }
    return onRemove ? (
      <Button
        type="button"
        variant="tertiary"
        color="neutral"
        size="nano"
        className="c__file-uploader__item__remove"
        aria-label={`${labels.remove} ${file.name}`}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(file);
        }}
        icon={<Icon name="close" size={18} aria-hidden="true" />}
      />
    ) : (
      <span
        className="c__file-uploader__item__status c__file-uploader__item__status--done"
        aria-hidden="true"
      >
        <CircleCheckFilled size={16} />
      </span>
    );
  };

  return (
    <li
      className={clsx(
        "c__file-uploader__item",
        `c__file-uploader__item--${status}`,
      )}
      data-testid="file-uploader-item"
    >
      <PreviewFileIcon
        file={{ title: file.name, mimetype: file.type ?? "" }}
        size={32}
      />
      <span className="c__file-uploader__item__name">
        {file.name}
        {status === "uploading" && ` – ${labels.uploading}`}
      </span>
      <span className="c__file-uploader__item__trailing">
        {status === "error" ? (
          <span className="c__file-uploader__item__error">
            {file.error ?? labels.genericError}
          </span>
        ) : (
          status !== "uploading" &&
          file.size !== undefined && (
            <span className="c__file-uploader__item__size">
              {formatBytes(file.size)}
            </span>
          )
        )}
        {renderTrailing()}
      </span>
    </li>
  );
};
