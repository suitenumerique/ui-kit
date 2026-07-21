import clsx from "clsx";
import { Button, Tooltip } from ":/cunningham";
import { CircleCheckFilled } from ":/components/icon/icons/CircleCheckFilled";
import { Error } from ":/components/icon/icons/Error";
import { XMark } from ":/components/icon/icons/XMark";
import { IconSize } from ":/components/icon/types";
import { FileIcon as PreviewFileIcon } from ":/components/preview/icons/FileIcon";
import { ResolvedUploadLabels, UploadFile } from "./types";
import { formatBytes } from "./utils";

export type UploadFileItemProps = {
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
  const { name, size, type } = file.originalFile;
  const hasAction =
    status === "uploading"
      ? onCancel !== undefined
      : status !== "error" && onRemove !== undefined;

  const renderStatus = () => {
    if (status === "uploading") {
      return (
        <span
          className="c__file-uploader__item__status c__file-uploader__item__status--uploading"
          role="progressbar"
          aria-label={`${name} – ${labels.uploading}`}
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
      const className =
        "c__file-uploader__item__status c__file-uploader__item__status--error";

      if (file.errorDetails) {
        return (
          <Tooltip placement="bottom" content={file.errorDetails}>
            <Button
              type="button"
              variant="tertiary"
              color="error"
              size="nano"
              className={`${className} c__file-uploader__item__error-trigger`}
              aria-label={file.errorDetails}
              onClick={(event) => event.stopPropagation()}
              icon={<Error size={16} aria-hidden="true" />}
            />
          </Tooltip>
        );
      }

      return (
        <span className={className} aria-hidden="true">
          <Error size={16} />
        </span>
      );
    }

    if (status === "pending") {
      return null;
    }

    return (
      <span
        className="c__file-uploader__item__status c__file-uploader__item__status--done"
        aria-hidden="true"
      >
        <CircleCheckFilled size={16} />
      </span>
    );
  };

  const renderAction = () => {
    if (status === "uploading" && onCancel) {
      return (
        <Button
          type="button"
          variant="tertiary"
          color="error"
          size="nano"
          className="c__file-uploader__item__action c__file-uploader__item__cancel"
          aria-label={labels.cancel}
          onClick={(e) => {
            e.stopPropagation();
            onCancel(file);
          }}
          icon={<XMark size={16} aria-hidden="true" />}
        />
      );
    }

    if (status !== "error" && status !== "uploading" && onRemove) {
      return (
        <Button
          type="button"
          variant="tertiary"
          color="error"
          size="nano"
          className="c__file-uploader__item__action c__file-uploader__item__remove"
          aria-label={`${labels.remove} ${name}`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(file);
          }}
          icon={<XMark size={16} aria-hidden="true" />}
        />
      );
    }

    return null;
  };

  return (
    <li
      className={clsx(
        "c__file-uploader__item",
        `c__file-uploader__item--${status}`,
        hasAction && "c__file-uploader__item--actionable",
      )}
      data-testid="file-uploader-item"
    >
      <PreviewFileIcon
        file={{ title: name, mimetype: type }}
        size={IconSize.LARGE}
      />
      <span className="c__file-uploader__item__name">
        {name}
        {status === "uploading" && ` – ${labels.uploading}`}
      </span>
      <span className="c__file-uploader__item__trailing">
        {status === "error" ? (
          <span className="c__file-uploader__item__error">
            {file.error ?? labels.genericError}
          </span>
        ) : (
          status !== "uploading" && (
            <span className="c__file-uploader__item__size">
              {formatBytes(size)}
            </span>
          )
        )}
        <span className="c__file-uploader__item__control">
          {renderStatus()}
          {renderAction()}
        </span>
      </span>
    </li>
  );
};
