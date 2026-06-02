import clsx from "clsx";
import { Icon } from ":/components/icon";
import { Spinner } from ":/components/loader/Spinner";
import { FileIcon as PreviewFileIcon } from ":/components/preview/icons/FileIcon";
import { ResolvedUploadLabels, UploadFile } from "./types";
import { formatBytes } from "./utils";

type UploadFileItemProps = {
  file: UploadFile;
  labels: ResolvedUploadLabels;
  onRemove?: (file: UploadFile) => void;
  onCancel?: (file: UploadFile) => void;
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

  const renderTrailing = () => {
    if (status === "uploading") {
      return onCancel ? (
        <button
          type="button"
          className="c__file-uploader__link c__file-uploader__link--danger c__file-uploader__item__cancel"
          onClick={() => onCancel(file)}
        >
          {labels.cancel}
        </button>
      ) : (
        <Spinner size="sm" />
      );
    }
    if (status === "error") {
      return (
        <Icon
          name="error"
          size={16}
          className="c__file-uploader__item__status c__file-uploader__item__status--error"
          aria-hidden="true"
        />
      );
    }
    return onRemove ? (
      <button
        type="button"
        className="c__file-uploader__item__remove"
        aria-label={`${labels.remove} ${file.name}`}
        onClick={() => onRemove(file)}
      >
        <Icon name="close" size={18} aria-hidden="true" />
      </button>
    ) : (
      <Icon
        name="check_circle"
        size={16}
        className="c__file-uploader__item__status c__file-uploader__item__status--done"
        aria-hidden="true"
      />
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
