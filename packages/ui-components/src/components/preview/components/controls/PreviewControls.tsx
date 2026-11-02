import { Button } from ":/cunningham";
import { useCunningham } from ":/components/provider";
import { FastBackward } from ":/components/icon/icons/FastBackward";
import { FastForward } from ":/components/icon/icons/FastForward";
import { Maximize } from ":/components/icon/icons/Maximize";
import { Pause } from ":/components/icon/icons/Pause";
import { Play } from ":/components/icon/icons/Play";
import { VolumeBar } from "../volume-bar/VolumeBar";
import { useEffect } from "react";
import clsx from "clsx";

export type PreviewControlsProps = {
  togglePlay: () => void;
  isPlaying: boolean;
  rewind10Seconds: () => void;
  forward10Seconds: () => void;
  volume: number;
  isMuted: boolean;
  toggleMute: () => void;
  handleVolumeChange: (newVolume: number) => void;
  toggleFullscreen: () => void;
  isFullscreen: boolean;
  showFullscreenBtn?: boolean;
};

export const PlayerPreviewControls = ({
  togglePlay,
  isPlaying,
  rewind10Seconds,
  forward10Seconds,
  volume,
  isMuted,
  toggleMute,
  handleVolumeChange,
  toggleFullscreen,
  isFullscreen,
  showFullscreenBtn = false,
}: PreviewControlsProps) => {
  const { t } = useCunningham();
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFullscreen) return;

      switch (event.code) {
        case "Space":
          event.preventDefault();
          togglePlay();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [togglePlay]);
  return (
    <div
      className={clsx("file-preview__controls", {
        "file-preview__controls--no-fullscreen-button": !showFullscreenBtn,
      })}
    >
      <Button
        variant="tertiary"
        color="neutral"
        onClick={togglePlay}
        size="small"
        aria-label={t(
          isPlaying
            ? "components.filePreview.actions.pause"
            : "components.filePreview.actions.play",
        )}
        icon={isPlaying ? <Pause aria-hidden /> : <Play aria-hidden />}
      />
      <VerticalSeparator />
      <Button
        variant="tertiary"
        color="neutral"
        onClick={rewind10Seconds}
        size="small"
        aria-label={t("components.filePreview.actions.rewind10")}
        icon={<FastBackward aria-hidden />}
      />
      <Button
        variant="tertiary"
        color="neutral"
        onClick={forward10Seconds}
        size="small"
        aria-label={t("components.filePreview.actions.forward10")}
        icon={<FastForward aria-hidden />}
      />
      <VerticalSeparator />

      <VolumeBar
        volume={volume}
        isMuted={isMuted}
        toggleMute={toggleMute}
        handleVolumeChange={handleVolumeChange}
      />

      {showFullscreenBtn && (
        <>
          <VerticalSeparator />

          <Button
            variant="tertiary"
            color="neutral"
            onClick={toggleFullscreen}
            className="suite-preview-controls__btn"
            size="small"
            aria-label={t(
              isFullscreen
                ? "components.filePreview.actions.exitFullscreen"
                : "components.filePreview.actions.enterFullscreen",
            )}
            icon={<Maximize aria-hidden />}
          />
        </>
      )}
    </div>
  );
};

const VerticalSeparator = () => {
  return <div className="file-preview__controls__separator" />;
};
