"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
} from "react";
import clsx from "clsx";
import { Icon } from ":/components/icon";
import { useCustomTranslations } from ":/hooks/useCustomTranslations";
import { DurationBar } from "../../components/duration-bar/DurationBar";
import { PlayerPreviewControls } from "../../components/controls/PreviewControls";
import type { HevcPlaybackController } from "../../utils/hevcVideo";

interface VideoPlayerProps {
  /**
   * Video source URL. May be omitted when the source is attached imperatively
   * to the forwarded video element (e.g. a MediaSource stream).
   */
  src?: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  width?: string | number;
  height?: string | number;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  /**
   * Skip the native playback attempt and transcode immediately. Useful to
   * exercise/demo the HEVC transcoding path on browsers that decode HEVC
   * natively (Safari, or Chrome/Brave on Apple Silicon).
   */
  forceTranscode?: boolean;
  /**
   * Rendered when the video can be neither played natively nor transcoded
   * (e.g. an unsupported codec on a browser without WebCodecs). When omitted,
   * the (empty) player is shown.
   */
  unsupportedFallback?: React.ReactNode;
}

// Playback strategy. HEVC/H.265 can't be told apart from H.264 by mimetype, so
// the player is native-first: it tries the browser, and only transcodes if the
// element can't decode the source. See the effects below.
type PlaybackMode = "native" | "transcoding" | "failed";

const hasNativeHevcSupport = (): boolean =>
  typeof MediaSource !== "undefined" &&
  (MediaSource.isTypeSupported('video/mp4; codecs="hvc1.1.6.L93.B0"') ||
    MediaSource.isTypeSupported('video/mp4; codecs="hev1.1.6.L93.B0"'));

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  (
    {
      src,
      poster,
      className,
      autoPlay = false,
      muted = false,
      loop = false,
      controls = true,
      width = "100%",
      height = "auto",
      onPlay,
      onPause,
      onEnded,
      onTimeUpdate,
      forceTranscode = false,
      unsupportedFallback = null,
    },
    forwardedRef
  ) => {
    const { t } = useCustomTranslations();
    const videoRef = useRef<HTMLVideoElement>(null);

    // Expose the underlying <video> through the forwarded ref while keeping the
    // internal ref the player relies on.
    const setVideoRef = useCallback(
      (el: HTMLVideoElement | null) => {
        videoRef.current = el;
        if (typeof forwardedRef === "function") {
          forwardedRef(el);
        } else if (forwardedRef) {
          forwardedRef.current = el;
        }
      },
      [forwardedRef]
    );
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(muted);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showStatusIcon, setShowStatusIcon] = useState(false);
    const [statusIcon, setStatusIcon] = useState<"play" | "pause">("play");
    const [playbackMode, setPlaybackMode] = useState<PlaybackMode>(
      forceTranscode && src ? "transcoding" : "native"
    );
    const [transcodeReady, setTranscodeReady] = useState(false);
    // Source is HDR and was transcoded to SDR — apply an approximate colour
    // correction (the transcoder doesn't tone-map, so HDR looks washed out).
    const [needsHdrCorrection, setNeedsHdrCorrection] = useState(false);

    const togglePlay = useCallback(async () => {
      if (videoRef.current) {
        try {
          if (isPlaying) {
            videoRef.current.pause();
          } else {
            if (videoRef.current.readyState === 0) {
              return;
            }
            await videoRef.current.play();
          }
        } catch (error) {
          console.error("Error toggling play:", error);
          setIsPlaying(false);
        }
      }
    }, [isPlaying]);

    const handleVolumeChange = useCallback((newVolume: number) => {
      setVolume(newVolume);
      if (videoRef.current) {
        videoRef.current.volume = newVolume;
        setIsMuted(newVolume === 0);
      }
    }, []);

    const toggleMute = useCallback(() => {
      if (videoRef.current) {
        const newIsMuted = !isMuted;
        videoRef.current.muted = newIsMuted;
        setIsMuted(newIsMuted);
      }
    }, [isMuted]);

    const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = parseFloat(e.target.value);
      setCurrentTime(newTime);
      if (videoRef.current) {
        videoRef.current.currentTime = newTime;
      }
    }, []);

    const toggleFullscreen = useCallback(() => {
      if (videoRef.current) {
        if (!isFullscreen) {
          videoRef.current.controls = true;
          if (videoRef.current.requestFullscreen) {
            videoRef.current.requestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      }
    }, [isFullscreen]);

    const rewind10Seconds = useCallback(() => {
      if (videoRef.current) {
        const newTime = Math.max(0, currentTime - 10);
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    }, [currentTime]);

    const forward10Seconds = useCallback(() => {
      if (videoRef.current) {
        const newTime = Math.min(duration, currentTime + 10);
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    }, [currentTime, duration]);

    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        // Only adopt a real, finite duration. MSE streams report `Infinity`
        // until they end (resolved later via `durationchange`), which would
        // otherwise render as "Infinity:NaN" in the controls.
        const d = videoRef.current.duration;
        if (Number.isFinite(d)) setDuration(d);
        videoRef.current.controls = false;
      }
    };

    // For Media Source streams the duration is `Infinity` at `loadedmetadata`
    // and only resolves once the stream ends, via `durationchange`.
    const handleDurationChange = () => {
      const next = videoRef.current?.duration;
      if (typeof next === "number" && Number.isFinite(next)) {
        setDuration(next);
      }
    };

    const handleTimeUpdate = () => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
        onTimeUpdate?.(videoRef.current.currentTime);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setStatusIcon("play");
      setShowStatusIcon(true);
      setTimeout(() => setShowStatusIcon(false), 500);
      onPlay?.();
    };

    const handlePause = () => {
      setIsPlaying(false);
      setStatusIcon("pause");
      setShowStatusIcon(true);
      setTimeout(() => setShowStatusIcon(false), 500);
      onPause?.();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onEnded?.();
    };

    const handleVolumeInput = () => {
      if (videoRef.current) {
        setVolume(videoRef.current.volume);
      }
    };

    const handleLoadStart = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    };

    useEffect(() => {
      const handleFullscreenChange = () => {
        const fullscreenElement = !!document.fullscreenElement;
        setIsFullscreen(fullscreenElement);

        if (videoRef.current) {
          if (fullscreenElement) {
            videoRef.current.controls = true;
          } else {
            videoRef.current.controls = false;
          }
        }
      };

      document.addEventListener("fullscreenchange", handleFullscreenChange);
      return () => {
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange
        );
      };
    }, []);

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        setShowStatusIcon(false);

        if (!videoRef.current.paused) {
          videoRef.current.pause();
        }
      }
    }, [src]);

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.volume = volume;
      }
    }, [volume]);

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.muted = isMuted;
      }
    }, [isMuted]);

    // Reset the playback strategy whenever the source changes.
    useEffect(() => {
      setPlaybackMode(forceTranscode && src ? "transcoding" : "native");
      setTranscodeReady(false);
      setNeedsHdrCorrection(false);
    }, [src, forceTranscode]);

    // Native-first HEVC handling: when the element can't decode the source,
    // switch to transcoding — unless the browser already supports HEVC, in
    // which case the failure is something transcoding can't fix.
    //
    // Two failure shapes to catch:
    //   • an `error` event (e.g. Firefox rejects the codec outright), and
    //   • a "silent" failure (Chrome/Brave parse the container, fire loadeddata
    //     and even play the audio, but never decode a video frame) — detectable
    //     because the element exposes no intrinsic video size.
    useEffect(() => {
      if (playbackMode !== "native" || !src) return;
      const video = videoRef.current;
      if (!video) return;

      const evaluate = () => {
        const undecodable =
          !!video.error ||
          (video.readyState >= video.HAVE_METADATA &&
            video.videoWidth === 0 &&
            video.videoHeight === 0);
        if (undecodable) {
          setPlaybackMode(hasNativeHevcSupport() ? "failed" : "transcoding");
        }
      };

      video.addEventListener("error", evaluate);
      video.addEventListener("loadedmetadata", evaluate);
      video.addEventListener("loadeddata", evaluate);
      // Metadata may already have arrived before these listeners attached.
      evaluate();

      return () => {
        video.removeEventListener("error", evaluate);
        video.removeEventListener("loadedmetadata", evaluate);
        video.removeEventListener("loadeddata", evaluate);
      };
    }, [playbackMode, src]);

    // Transcoding pipeline. The WASM codec is lazy-loaded so it only downloads
    // when a video actually needs it (kept out of the main bundle).
    useEffect(() => {
      if (playbackMode !== "transcoding" || !src) return;
      const video = videoRef.current;
      if (!video) return;

      const controller = new AbortController();
      let playback: HevcPlaybackController | null = null;
      setTranscodeReady(false);

      import("../../utils/hevcVideo")
        .then(({ playHevcViaTranscoding }) =>
          playHevcViaTranscoding(video, src, controller.signal)
        )
        .then((ctrl) => {
          if (controller.signal.aborted) {
            ctrl.destroy();
            return;
          }
          playback = ctrl;
          setTranscodeReady(true);
          setNeedsHdrCorrection(ctrl.isHdr);
        })
        .catch((err) => {
          if (controller.signal.aborted) return;
          console.error("VideoPlayer: HEVC transcoding failed", err);
          setPlaybackMode("failed");
        });

      return () => {
        controller.abort();
        playback?.destroy();
      };
    }, [playbackMode, src]);

    if (playbackMode === "failed" && unsupportedFallback) {
      return <>{unsupportedFallback}</>;
    }

    return (
      <div
        className={clsx("video-player", className)}
        style={{ width, height }}
      >
        <div
          className="video-player__video__wrapper"
          onMouseLeave={() => setShowStatusIcon(false)}
        >
          <video
            ref={setVideoRef}
            // In transcoding mode the source is attached imperatively via MSE.
            src={playbackMode === "native" ? src : undefined}
            poster={poster}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            controls={false}
            onLoadedMetadata={handleLoadedMetadata}
            onDurationChange={handleDurationChange}
            onTimeUpdate={handleTimeUpdate}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
            onVolumeChange={handleVolumeInput}
            onClick={togglePlay}
            className={clsx("video-player__video", {
              "video-player__video--tonemap": needsHdrCorrection,
            })}
            onLoadStart={handleLoadStart}
          />
          {showStatusIcon && (
            <div className="video-player__status-icon">
              <Icon name={statusIcon === "play" ? "play_arrow" : "pause"} />
            </div>
          )}
          {playbackMode === "transcoding" && !transcodeReady && (
            <div
              className="video-player__transcoding"
              data-preview-backdrop="true"
            >
              <div className="video-player__spinner" />
              <span>{t("components.filePreview.video.preparing")}</span>
            </div>
          )}
        </div>

        {controls && !isFullscreen && (
          <div className="video-player__controls">
            <DurationBar
              duration={duration}
              currentTime={currentTime}
              handleSeek={handleSeek}
            />
            <PlayerPreviewControls
              togglePlay={togglePlay}
              isPlaying={isPlaying}
              rewind10Seconds={rewind10Seconds}
              forward10Seconds={forward10Seconds}
              volume={volume}
              isMuted={isMuted}
              toggleMute={toggleMute}
              handleVolumeChange={handleVolumeChange}
              toggleFullscreen={toggleFullscreen}
              isFullscreen={isFullscreen}
              showFullscreenBtn={true}
            />
          </div>
        )}
      </div>
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";
