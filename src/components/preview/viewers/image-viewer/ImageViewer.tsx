import React, { useState, useRef, useCallback, useEffect } from "react";
import { useCustomTranslations } from ":/hooks/useCustomTranslations";
import { ZoomControls } from "../../components/ZoomControls/ZoomControls";

interface ImageViewerProps {
  src: string;
  alt?: string;
  className?: string;
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
}

interface ImageDimensions {
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
  originalZoom: number;
}

interface TouchPoint {
  x: number;
  y: number;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  src,
  alt = "Image",
  className = "",
  initialZoom = 1,
  minZoom = 0.1,
  maxZoom = 5,
  zoomStep = 0.25,
}) => {
  const { t } = useCustomTranslations();
  const [zoom, setZoom] = useState(initialZoom);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions>({
    width: 0,
    height: 0,
    naturalWidth: 0,
    naturalHeight: 0,
    originalZoom: 1,
  });

  const [touchStart, setTouchStart] = useState<TouchPoint | null>(null);
  const [touchDistance, setTouchDistance] = useState<number | null>(null);
  const [initialZoomOnTouch, setInitialZoomOnTouch] = useState<number>(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const mouseDownPosRef = useRef<{ x: number; y: number } | null>(null);

  const getTouchDistance = useCallback(
    (touch1: React.Touch, touch2: React.Touch): number => {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    },
    [],
  );

  useEffect(() => {
    const preloadImage = new Image();

    preloadImage.onload = () => {
      if (containerRef.current) {
        const { naturalWidth, naturalHeight } = preloadImage;
        const containerRect = containerRef.current.getBoundingClientRect();

        let calculatedZoom = 1;
        let displayWidth = naturalWidth;
        let displayHeight = naturalHeight;

        const marginFactor = 0.2;
        const availableWidth = containerRect.width * (1 - marginFactor);
        const availableHeight = containerRect.height * (1 - marginFactor);

        if (
          naturalWidth <= availableWidth &&
          naturalHeight <= availableHeight
        ) {
          calculatedZoom = 1;
          displayWidth = naturalWidth;
          displayHeight = naturalHeight;
        } else {
          const availableAspectRatio = availableWidth / availableHeight;
          const imageAspectRatio = naturalWidth / naturalHeight;

          if (imageAspectRatio > availableAspectRatio) {
            calculatedZoom = availableWidth / naturalWidth;
            displayWidth = availableWidth;
            displayHeight = availableWidth / imageAspectRatio;
          } else {
            calculatedZoom = availableHeight / naturalHeight;
            displayHeight = availableHeight;
            displayWidth = availableHeight * imageAspectRatio;
          }
        }

        setImageDimensions({
          width: displayWidth,
          height: displayHeight,
          naturalWidth,
          naturalHeight,
          originalZoom: calculatedZoom,
        });

        setZoom(calculatedZoom);
        setImageLoaded(true);
      }
    };

    preloadImage.onerror = () => {
      setImageLoaded(true);
    };

    preloadImage.src = src;
  }, [src]);

  const isImageExceedingBounds = useCallback(() => {
    if (!containerRef.current || !imageRef.current) return false;

    const containerRect = containerRef.current.getBoundingClientRect();
    const scaledWidth = imageDimensions.naturalWidth * zoom;
    const scaledHeight = imageDimensions.naturalHeight * zoom;

    return (
      scaledWidth > containerRect.width || scaledHeight > containerRect.height
    );
  }, [zoom, imageDimensions]);

  const getConstrainedPosition = useCallback(
    (newPosition: { x: number; y: number }) => {
      if (!containerRef.current || !imageRef.current) return newPosition;

      const containerRect = containerRef.current.getBoundingClientRect();
      const scaledWidth = imageDimensions.naturalWidth * zoom;
      const scaledHeight = imageDimensions.naturalHeight * zoom;

      const maxX = Math.max(0, (scaledWidth - containerRect.width) / 2);
      const minX = -maxX;
      const maxY = Math.max(0, (scaledHeight - containerRect.height) / 2);
      const minY = -maxY;

      return {
        x: Math.max(minX, Math.min(maxX, newPosition.x)),
        y: Math.max(minY, Math.min(maxY, newPosition.y)),
      };
    },
    [zoom, imageDimensions],
  );

  const zoomIn = useCallback(() => {
    setZoom((prevZoom) => Math.min(prevZoom + zoomStep, maxZoom));
  }, [zoomStep, maxZoom]);

  const zoomOut = useCallback(() => {
    setZoom((prevZoom) => Math.max(prevZoom - zoomStep, minZoom));
  }, [zoomStep, minZoom]);

  const resetView = useCallback(() => {
    setZoom(imageDimensions.originalZoom);
    setPosition({ x: 0, y: 0 });
  }, [imageDimensions.originalZoom]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
      if (isImageExceedingBounds()) {
        setIsDragging(true);
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        });
      }
    },
    [isImageExceedingBounds, position],
  );

  // Swallow the click that follows a pan-drag so it never bubbles to the
  // FilePreview backdrop handler. Without this, releasing a drag on the
  // empty area of the container would close the preview.
  const handleClickCapture = useCallback((e: React.MouseEvent) => {
    const start = mouseDownPosRef.current;
    mouseDownPosRef.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (dx * dx + dy * dy > 16) {
      e.stopPropagation();
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging && isImageExceedingBounds()) {
        const newPosition = {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        };
        setPosition(getConstrainedPosition(newPosition));
      }
    },
    [isDragging, dragStart, isImageExceedingBounds, getConstrainedPosition],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
      setZoom((prevZoom) =>
        Math.max(minZoom, Math.min(maxZoom, prevZoom + delta)),
      );
    },
    [zoomStep, minZoom, maxZoom],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();

      if (e.touches.length === 1) {
        if (isImageExceedingBounds()) {
          setIsDragging(true);
          setTouchStart({
            x: e.touches[0].clientX - position.x,
            y: e.touches[0].clientY - position.y,
          });
        }
      } else if (e.touches.length === 2) {
        setIsDragging(false);
        const distance = getTouchDistance(e.touches[0], e.touches[1]);
        setTouchDistance(distance);
        setInitialZoomOnTouch(zoom);
      }
    },
    [isImageExceedingBounds, position, zoom, getTouchDistance],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();

      if (e.touches.length === 1 && isDragging && touchStart) {
        const newPosition = {
          x: e.touches[0].clientX - touchStart.x,
          y: e.touches[0].clientY - touchStart.y,
        };
        setPosition(getConstrainedPosition(newPosition));
      } else if (e.touches.length === 2 && touchDistance !== null) {
        const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);
        const scale = currentDistance / touchDistance;
        const newZoom = Math.max(
          minZoom,
          Math.min(maxZoom, initialZoomOnTouch * scale),
        );
        setZoom(newZoom);
      }
    },
    [
      isDragging,
      touchStart,
      touchDistance,
      initialZoomOnTouch,
      getConstrainedPosition,
      getTouchDistance,
      minZoom,
      maxZoom,
    ],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setTouchStart(null);
    setTouchDistance(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target !== containerRef.current) return;

      switch (e.key) {
        case "+":
        case "=":
          e.preventDefault();
          zoomIn();
          break;
        case "-":
          e.preventDefault();
          zoomOut();
          break;
        case "0":
          e.preventDefault();
          resetView();
          break;
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("keydown", handleKeyDown);
      return () => container.removeEventListener("keydown", handleKeyDown);
    }
  }, [zoomIn, zoomOut, resetView]);

  useEffect(() => {
    if (zoom <= imageDimensions.originalZoom) {
      setPosition({ x: 0, y: 0 });
    } else {
      setPosition(getConstrainedPosition(position));
    }
  }, [zoom, getConstrainedPosition, imageDimensions.originalZoom]);

  const getCursorStyle = useCallback(() => {
    if (isDragging) return "grabbing";
    if (isImageExceedingBounds()) return "grab";
    return "default";
  }, [isDragging, isImageExceedingBounds]);

  return (
    <div className={`image-viewer ${className}`}>
      <div
        ref={containerRef}
        className="image-viewer__container"
        data-preview-backdrop="true"
        tabIndex={0}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClickCapture={handleClickCapture}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: getCursorStyle(),
          touchAction: "none",
        }}
      >
        {imageLoaded && (
          <div
            className="image-viewer__image-wrapper"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            }}
          >
            <img
              ref={imageRef}
              src={src}
              alt={alt}
              className="image-viewer__image"
              draggable={false}
              style={{
                width: imageDimensions.naturalWidth,
                height: imageDimensions.naturalHeight,
              }}
            />
          </div>
        )}

        {!imageLoaded && (
          <div className="image-viewer__loading">
            <div className="image-viewer__spinner"></div>
            <span>{t("components.filePreview.image.loading")}</span>
          </div>
        )}
      </div>

      <div className="file-preview__controls">
        <ZoomControls zoomOut={zoomOut} zoomIn={zoomIn} resetView={resetView} />
      </div>
    </div>
  );
};
