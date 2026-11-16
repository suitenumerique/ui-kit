import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useCunningham } from ":/components/provider";
import type { ButtonElement } from ":/components/button";
import { GenericSupportFormLabels } from "./types";
import { formatFileSize, isAcceptedType } from "./utils";

type UseSupportFormFilesOptions = {
  labels: GenericSupportFormLabels;
  maxFiles?: number;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
};

/**
 * The attached files: the list, the refusals with their reason, and the
 * keyboard focus when the upload button appears or disappears.
 */
export const useSupportFormFiles = ({
  labels,
  maxFiles,
  maxFileSize,
  acceptedFileTypes,
}: UseSupportFormFilesOptions) => {
  const { currentLocale } = useCunningham();
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string>();
  const uploadButtonRef = useRef<ButtonElement>(null);
  const removeButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  // The upload button disappears at maxFiles and comes back on removal: keep
  // the keyboard focus on a nearby control instead of losing it.
  const focusAfterChangeRef = useRef<"lastRemove" | "upload" | null>(null);

  const canAddFiles = maxFiles === undefined || files.length < maxFiles;

  const getRefusal = useCallback(
    (file: File) => {
      if (acceptedFileTypes?.length && !isAcceptedType(file, acceptedFileTypes))
        return labels.fileTypeInvalid;
      if (maxFileSize && file.size > maxFileSize)
        return labels.fileTooLarge.replace(
          "{size}",
          formatFileSize(maxFileSize, currentLocale),
        );
      return undefined;
    },
    [acceptedFileTypes, maxFileSize, labels, currentLocale],
  );

  const addFiles = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
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
        const refusal = getRefusal(file);
        if (refusal) {
          error = refusal;
          continue;
        }
        accepted.push(file);
      }
      if (
        maxFiles !== undefined &&
        accepted.length > 0 &&
        files.length + accepted.length >= maxFiles
      ) {
        focusAfterChangeRef.current = "lastRemove";
      }
      setFiles((prev) => [...prev, ...accepted]);
      setFileError(error);
    },
    [files.length, maxFiles, labels, getRefusal],
  );

  const removeFile = useCallback((index: number) => {
    // The removed chip had the focus: hand it to the upload button.
    focusAfterChangeRef.current = "upload";
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError(undefined);
  }, []);

  useEffect(() => {
    const target = focusAfterChangeRef.current;
    focusAfterChangeRef.current = null;
    if (target === "lastRemove") {
      removeButtonsRef.current[files.length - 1]?.focus();
    }
    if (target === "upload") {
      uploadButtonRef.current?.focus();
    }
  }, [files.length]);

  const clearFileError = useCallback(() => setFileError(undefined), []);

  const resetFiles = useCallback(() => {
    setFiles([]);
    setFileError(undefined);
  }, []);

  return {
    files,
    fileError,
    canAddFiles,
    addFiles,
    removeFile,
    clearFileError,
    resetFiles,
    uploadButtonRef,
    removeButtonsRef,
  };
};

export type SupportFormFiles = ReturnType<typeof useSupportFormFiles>;
