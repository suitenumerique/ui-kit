import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import {
  Button,
  ButtonProps,
  Modal,
  ModalSize,
} from "@gouvfr-lasuite/cunningham-react";
import clsx from "clsx";
import { Icon, IconSize, IconType } from ":/components/icon";
import { DropdownMenu } from ":/components/dropdown-menu";
import { useCustomTranslations } from ":/hooks/useCustomTranslations";

import { FilePreviewType } from "./types";
import {
  getMimeCategory,
  MimeCategory,
  removeFileExtension,
} from "./utils/mimeTypes";
import { printImage } from "./utils/printImage";
import { FileIcon } from "./icons/FileIcon";
import { VideoPlayer } from "./viewers/video-player/VideoPlayer";
import { AudioPlayer } from "./viewers/audio-player/AudioPlayer";
import { ImageViewer } from "./viewers/image-viewer/ImageViewer";
import { SuspiciousPreview } from "./viewers/suspicious/SuspiciousPreview";
import { NotSupportedPreview } from "./viewers/not-supported/NotSupportedPreview";
import { WopiOpenInEditor } from "./viewers/wopi/WopiOpenInEditor";
import { OPEN_DELAY } from "./viewers/pdf-preview/pdfConsts";
import { OutdatedBrowserPreview } from "./viewers/pdf-preview/OutdatedBrowserPreview";

// Lazy-load PDF rendering — react-pdf + pdfjs-dist + react-virtualized weigh
// over a megabyte gzipped, and most previews aren't PDFs. We narrow the
// fallback to module-resolution errors only (consumer didn't install the
// optional peer deps). Any other error must surface so we can diagnose it
// instead of being masked as "outdated browser".
const isMissingPeerDepError = (err: unknown): boolean => {
  if (!(err instanceof Error)) return false;
  const msg = err.message;
  return (
    /Failed to (fetch|resolve) (dynamically imported )?module/i.test(msg) ||
    /Cannot find (module|package)/i.test(msg) ||
    /Importing a module script failed/i.test(msg)
  );
};

const PreviewPdf = lazy(() =>
  import("./viewers/pdf-preview/PdfPreview")
    .then((mod) => ({ default: mod.PdfPreview }))
    .catch((err) => {
      if (isMissingPeerDepError(err)) {
        return {
          default:
            OutdatedBrowserPreview as unknown as typeof import("./viewers/pdf-preview/PdfPreview").PdfPreview,
        };
      }
      throw err;
    }),
);

export type { FilePreviewType } from "./types";

type FilePreviewData = FilePreviewType & {
  category: MimeCategory;
};

interface FilePreviewProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  files?: FilePreviewType[];
  initialIndexFile?: number;
  openedFileId?: string;
  headerRightContent?: React.ReactNode;
  sidebarContent?: React.ReactNode;
  onChangeFile?: (file?: FilePreviewType) => void;
  onFileOpen?: (file: FilePreviewType) => void;
  handleDownloadFile?: (file?: FilePreviewType) => void;
  hideCloseButton?: boolean;
  pdfWorkerSrc?: string;
  onOpenInEditor?: (file: FilePreviewType) => void;
}

export const FilePreview = ({
  isOpen,
  onClose,
  title = "File Preview",
  files = [],
  initialIndexFile = -1,
  openedFileId,
  sidebarContent,
  headerRightContent,
  onChangeFile,
  onFileOpen,
  handleDownloadFile,
  hideCloseButton,
  pdfWorkerSrc,
  onOpenInEditor,
}: FilePreviewProps) => {
  const { t } = useCustomTranslations();
  const [currentIndex, setCurrentIndex] = useState(initialIndexFile);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [classNames, setClassNames] = useState<string[]>([]);
  const [pdfThumbnailSidebarOpen, setPdfThumbnailSidebarOpen] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);

  const data: FilePreviewData[] = useMemo(() => {
    return files?.map((file) => ({
      ...file,
      is_wopi_supported: file.is_wopi_supported ?? false,
      category: getMimeCategory(file.mimetype),
    }));
  }, [files]);

  const currentFile: FilePreviewData | undefined =
    currentIndex > -1 ? data[currentIndex] : undefined;

  const canGoNext = currentIndex < data.length - 1;
  const canGoPrevious = currentIndex > 0;

  const goToNext = () => {
    if (canGoNext) setCurrentIndex(currentIndex + 1);
  };

  const goToPrevious = () => {
    if (canGoPrevious) setCurrentIndex(currentIndex - 1);
  };

  const handleDownload = async () => {
    handleDownloadFile?.(currentFile);
  };

  const handlePrint = () => {
    if (!currentFile) return;

    if (currentFile.category === MimeCategory.IMAGE) {
      printImage(currentFile.url_preview);
      return;
    }

    window.open(currentFile.url_preview, "_blank");
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!(e.target instanceof HTMLElement)) return;
    if (
      e.target === e.currentTarget ||
      e.target.dataset.previewBackdrop === "true"
    ) {
      onClose?.();
    }
  };

  const renderViewer = () => {
    if (!currentFile) {
      return <div>{t("components.filePreview.unsupported.title")}</div>;
    }

    if (currentFile.isSuspicious) {
      return <SuspiciousPreview handleDownload={handleDownload} />;
    }
    if (currentFile.is_wopi_supported && onOpenInEditor) {
      return (
        <WopiOpenInEditor file={currentFile} onOpenInEditor={onOpenInEditor} />
      );
    }

    switch (currentFile.category) {
      case MimeCategory.IMAGE:
        if (currentFile.mimetype.includes("heic")) {
          return (
            <NotSupportedPreview
              title={t("components.filePreview.unsupported.heicTitle")}
              file={currentFile}
              onDownload={handleDownload}
            />
          );
        }

        return (
          <ImageViewer
            src={currentFile.url_preview}
            alt={currentFile.title}
            className="file-preview__viewer"
            // Avoid splash effect when switching between images of very
            // different sizes by remounting per file id.
            key={currentFile.id}
          />
        );
      case MimeCategory.VIDEO:
        return (
          <div
            className="video-preview-viewer-container"
            data-preview-backdrop="true"
          >
            <div className="video-preview-viewer">
              <VideoPlayer
                src={currentFile.url_preview}
                className="file-preview__viewer"
                controls={true}
              />
            </div>
          </div>
        );
      case MimeCategory.AUDIO:
        return (
          <div
            className="video-preview-viewer-container"
            data-preview-backdrop="true"
          >
            <div className="video-preview-viewer">
              <AudioPlayer
                src={currentFile.url_preview}
                title={currentFile.title}
                className="file-preview__viewer"
              />
            </div>
          </div>
        );
      case MimeCategory.PDF:
        return (
          <Suspense fallback={null}>
            <PreviewPdf
              src={currentFile.url_preview}
              pdfWorkerSrc={pdfWorkerSrc}
              onThumbailSidebarOpen={(isOpen) => {
                setPdfThumbnailSidebarOpen(isOpen);
              }}
            />
          </Suspense>
        );

      default:
        return (
          <NotSupportedPreview file={currentFile} onDownload={handleDownload} />
        );
    }
  };

  // Add a specific class name to the container when the PDF thumbnail sidebar is open.
  // So the navigation buttons can move in sync.
  useEffect(() => {
    const className = "file-preview__container--pdf-sidebar-open";
    const isPdf = currentFile?.category === MimeCategory.PDF;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (pdfThumbnailSidebarOpen && isPdf) {
      timeoutId = setTimeout(() => {
        setClassNames((prev) => {
          if (prev.includes(className)) {
            return prev;
          }
          return [...prev, className];
        });
      }, OPEN_DELAY);
    } else {
      setClassNames((prev) => {
        return prev.filter((className_) => className_ !== className);
      });
    }

    if (pdfThumbnailSidebarOpen && !isPdf) {
      setPdfThumbnailSidebarOpen(false);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pdfThumbnailSidebarOpen, currentFile]);

  useEffect(() => {
    if (openedFileId) {
      const index = data.findIndex((file) => file.id === openedFileId);
      const newIndex = index > -1 ? index : -1;
      setCurrentIndex(newIndex);
    } else {
      setCurrentIndex(-1);
    }
  }, [openedFileId, data]);

  useEffect(() => {
    onChangeFile?.(currentFile);
    if (currentFile) {
      onFileOpen?.(currentFile);
    }
  }, [currentFile]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, data.length, currentFile?.category]);

  useEffect(() => {
    if (!isOpen || !currentFile) return;
    const previousTitle = document.title;
    document.title = currentFile.title;
    return () => {
      document.title = previousTitle;
    };
  }, [isOpen, currentFile]);

  if (!isOpen || !currentFile) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onClose?.()}
      size={ModalSize.FULL}
      hideCloseButton={true}
    >
      <div data-testid="file-preview">
        <div
          onClick={handleBackdropClick}
          className={clsx(
            "file-preview__container",
            isSidebarOpen && "file-preview__container--sidebar-open",
            classNames,
          )}
        >
          <div className="file-preview__header">
            <div className="file-preview__header__content">
              <div className="file-preview__header__content__left">
                {!hideCloseButton && (
                  <Button
                    variant="tertiary"
                    size="small"
                    onClick={onClose}
                    icon={<Icon name="close" />}
                  />
                )}

                <div className="file-preview__title-wrapper">
                  <FileIcon
                    file={currentFile}
                    type="mini"
                    size={IconSize.SMALL}
                  />
                  <h1 className="file-preview__title">
                    {removeFileExtension(currentFile?.title || title)}
                  </h1>
                </div>
              </div>
              <div className="file-preview__header__content__right">
                {headerRightContent}
                {handleDownloadFile && (
                  <Button
                    variant="tertiary"
                    onClick={handleDownload}
                    icon={
                      <Icon type={IconType.OUTLINED} name={"file_download"} />
                    }
                  />
                )}
                <Button
                  variant="tertiary"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  icon={<Icon name={"info_outline"} />}
                />
                {(currentFile?.category === MimeCategory.PDF ||
                  currentFile?.category === MimeCategory.IMAGE) && (
                  <DropdownMenu
                    options={[
                      ...(handleDownloadFile
                        ? [
                            {
                              icon: (
                                <Icon
                                  type={IconType.OUTLINED}
                                  name="file_download"
                                />
                              ),
                              label: t(
                                "components.filePreview.actions.download",
                              ),
                              value: "download",
                              callback: handleDownload,
                            },
                          ]
                        : []),
                      {
                        icon: <Icon name="print" />,
                        label: t("components.filePreview.actions.print"),
                        value: "print",
                        callback: handlePrint,
                      },
                    ]}
                    isOpen={isActionsMenuOpen}
                    onOpenChange={setIsActionsMenuOpen}
                  >
                    <Button
                      variant="tertiary"
                      onClick={() => setIsActionsMenuOpen(!isActionsMenuOpen)}
                      icon={<Icon name="more_vert" />}
                    />
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
          <div className="file-preview__content">
            <div className="file-preview__main">
              {renderViewer()}
              <FilePreviewPreviousButton
                onClick={goToPrevious}
                disabled={!canGoPrevious}
              />
              <FilePreviewNextButton onClick={goToNext} disabled={!canGoNext} />
            </div>

            <div
              className={`file-preview-sidebar ${isSidebarOpen ? "open" : ""}`}
            >
              {sidebarContent}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const FilePreviewNextButton = (props: Partial<ButtonProps>) => {
  return (
    <div className="file-preview__next-button">
      <Button
        {...props}
        icon={<Icon name="arrow_forward" />}
        color="brand"
        variant="tertiary"
        size="small"
      />
    </div>
  );
};

const FilePreviewPreviousButton = (props: Partial<ButtonProps>) => {
  return (
    <div className="file-preview__previous-button">
      <Button
        {...props}
        icon={<Icon name="arrow_back" />}
        color="brand"
        variant="tertiary"
        size="small"
      />
    </div>
  );
};
