import { useState } from "react";
import type { ShareImportRow } from "../import-modal/ShareImportModal";

type ShareImportOptions = {
  onImportContacts?: (rows: ShareImportRow[]) => Promise<boolean> | boolean;
  onImportFileChange?: (file?: File) => void;
};

type ImportStatus = "idle" | "submitting" | "failed";

/** Manages the import dialog lifecycle, submission status, and failure reset. */
export const useShareImport = ({
  onImportContacts,
  onImportFileChange,
}: ShareImportOptions) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<ImportStatus>("idle");

  const close = () => {
    setIsOpen(false);
    setStatus("idle");
  };

  const changeFile = (file?: File) => {
    setStatus((current) => (current === "failed" ? "idle" : current));
    onImportFileChange?.(file);
  };

  const submit = async (rows: ShareImportRow[]) => {
    if (!onImportContacts) {
      close();
      return;
    }
    setStatus("submitting");
    try {
      if (await onImportContacts(rows)) {
        close();
      } else {
        setStatus("failed");
      }
    } catch {
      // Rejection and false both keep the file available for another attempt.
      setStatus("failed");
    }
  };

  return {
    isOpen,
    isImporting: status === "submitting",
    hasFailed: status === "failed",
    open: () => setIsOpen(true),
    close,
    changeFile,
    submit,
  };
};
