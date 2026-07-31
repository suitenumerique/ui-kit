import { FileUploader, UploadFile } from ":/components/form/file-uploader";
import { Spinner } from ":/components/loader/Spinner";
import { Button } from ":/components/button";
import { Modal, ModalProps, ModalSize } from ":/components/modal";
import { useCunningham } from ":/components/provider";
import { PropsWithChildren, useRef, useState } from "react";
import {
  ACCEPTED_FILE_EXTENSIONS,
  parseShareImportFile,
  ShareImportParseError,
  ShareImportRow,
} from "./utils";
import contactsTemplateUrl from "./assets/contacts.csv?url";

const downloadTemplate = () => {
  const link = document.createElement("a");
  link.href = contactsTemplateUrl;
  link.download = "contacts.csv";
  link.click();
};

export type { ShareImportRow } from "./utils";

type ShareImportModalProps = Pick<ModalProps, "isOpen" | "onClose"> &
  PropsWithChildren & {
    title?: string;
    description?: string;
    maxRows?: number;
    onDownloadTemplate?: () => void;
    onImport?: (rows: ShareImportRow[]) => void;
    isImporting?: boolean;
    onFileChange?: (file?: File) => void;
    /** Displayed on the uploader when the import itself fails. */
    importError?: string;
  };

export const ShareImportModal = (props: ShareImportModalProps) => {
  const { t } = useCunningham();
  const [file, setFile] = useState<UploadFile>();
  const [rows, setRows] = useState<ShareImportRow[]>();
  const [parseError, setParseError] = useState<ShareImportParseError>();
  const [isInvalidFile, setIsInvalidFile] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  // Once the import has been requested, the parse alerts are stale: the
  // remaining feedback (spinner, consumer error) comes from the import itself.
  const [importRequested, setImportRequested] = useState(false);
  // Guards against a slow parse of a previous file overwriting the
  // state of the file selected after it.
  const parseRequestId = useRef(0);

  const resetFile = () => {
    parseRequestId.current++;
    props.onFileChange?.(undefined);
    setFile(undefined);
    setRows(undefined);
    setParseError(undefined);
    setIsInvalidFile(false);
    setIsParsing(false);
    setImportRequested(false);
  };

  const parseErrorMessage = parseError
    ? t(
        `components.share.import.errors.${parseError.type}`,
        parseError.type === "invalid_row"
          ? { row: parseError.row }
          : parseError.type === "too_many_rows"
          ? { max: parseError.max }
          : undefined,
      )
    : undefined;
  const fileErrorMessage = isInvalidFile
    ? t("components.share.import.invalid_file_type")
    : parseErrorMessage;

  const parsedRowsMessage =
    rows && !importRequested
      ? t(
          rows.length === 1
            ? "components.share.import.parsed_rows_singular"
            : "components.share.import.parsed_rows_plural",
          { count: rows.length },
        )
      : undefined;

  // The uploader is controlled: the file status reflects the parse lifecycle.
  const uploaderFiles: UploadFile[] = file
    ? [
        {
          ...file,
          status: isParsing ? "uploading" : fileErrorMessage ? "error" : "done",
          error: fileErrorMessage,
        },
      ]
    : [];

  return (
    <Modal
      {...props}
      preventClose={props.isImporting}
      size={ModalSize.MEDIUM}
      title={props.title ?? t("components.share.import.title")}
      leftActions={
        <Button
          color="neutral"
          variant="tertiary"
          onClick={props.onDownloadTemplate ?? downloadTemplate}
        >
          {t("components.share.import.download_template")}
        </Button>
      }
      rightActions={
        <>
          <Button
            color="neutral"
            variant="bordered"
            disabled={props.isImporting}
            onClick={props.onClose}
          >
            {t("components.share.import.cancel")}
          </Button>
          <Button
            color="brand"
            variant="primary"
            disabled={!rows?.length || props.isImporting}
            icon={props.isImporting ? <Spinner /> : undefined}
            onClick={() => {
              if (!rows) {
                return;
              }
              setImportRequested(true);
              props.onImport?.(rows);
            }}
          >
            {t("components.share.import.import")}
          </Button>
        </>
      }
    >
      <div className="c__share__import__modal">
        <div className="c__modal__content__text--light">
          {props.description ?? t("components.share.import.description")}
        </div>
        <FileUploader
          accept={ACCEPTED_FILE_EXTENSIONS.join(",")}
          files={uploaderFiles}
          onAddFiles={async (files) => {
            const selected = files[0];
            props.onFileChange?.(selected?.originalFile);
            const requestId = ++parseRequestId.current;
            setFile(selected);
            setRows(undefined);
            setParseError(undefined);
            setIsParsing(false);
            setImportRequested(false);
            const isAccepted =
              !!selected &&
              ACCEPTED_FILE_EXTENSIONS.some((extension) =>
                selected.originalFile.name.toLowerCase().endsWith(extension),
              );
            setIsInvalidFile(!!selected && !isAccepted);
            if (!selected || !isAccepted) {
              return;
            }
            setIsParsing(true);
            const result = await parseShareImportFile(selected.originalFile, {
              maxRows: props.maxRows,
            });
            if (requestId !== parseRequestId.current) {
              return;
            }
            setIsParsing(false);
            setRows(result.rows);
            setParseError(result.error);
          }}
          onRemoveFile={resetFile}
          onCancelFile={resetFile}
          description={props.importError ?? parsedRowsMessage}
          descriptionMode={props.importError ? "error" : "default"}
        />
        {props.children}
      </div>
    </Modal>
  );
};
