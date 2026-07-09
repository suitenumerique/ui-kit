import React, { useEffect, useState } from "react";
import { useCustomTranslations } from ":/hooks/useCustomTranslations";
import { decodeHeicToObjectUrl } from "../../utils/decodeHeic";
import { ImageViewer } from "./ImageViewer";

interface HeicImageViewerProps {
  src: string;
  alt?: string;
  className?: string;
  /** Rendered when decoding fails (e.g. download fallback). */
  errorFallback?: React.ReactNode;
}

/**
 * Decodes a HEIC/HEIF image to a renderable object URL, then hands it to the
 * regular {@link ImageViewer}. The WASM codec is lazy-loaded by
 * {@link decodeHeicToObjectUrl}, so this only pays its cost when a HEIC file is
 * opened. Shows the image-viewer loading state while decoding.
 */
export const HeicImageViewer: React.FC<HeicImageViewerProps> = ({
  src,
  alt,
  className = "",
  errorFallback = null,
}) => {
  const { t } = useCustomTranslations();
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    const controller = new AbortController();
    setResolvedSrc(null);
    setFailed(false);

    decodeHeicToObjectUrl(src, controller.signal)
      .then((url) => {
        // Decoding can outlive the effect (navigation / unmount). If we've been
        // aborted, drop the result instead of leaking the URL / setting state.
        if (controller.signal.aborted) {
          URL.revokeObjectURL(url);
          return;
        }
        objectUrl = url;
        setResolvedSrc(url);
      })
      .catch((err) => {
        if (controller.signal.aborted) {
          return;
        }
        console.error("Failed to decode HEIC image", err);
        setFailed(true);
      });

    return () => {
      controller.abort();
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  if (failed) {
    return <>{errorFallback}</>;
  }

  if (!resolvedSrc) {
    return (
      <div className={`image-viewer ${className}`}>
        <div className="image-viewer__container" data-preview-backdrop="true">
          <div className="image-viewer__loading">
            <div className="image-viewer__spinner"></div>
            <span>{t("components.filePreview.image.loading")}</span>
          </div>
        </div>
      </div>
    );
  }

  return <ImageViewer src={resolvedSrc} alt={alt} className={className} />;
};
