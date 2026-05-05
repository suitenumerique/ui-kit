"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import { Icon } from ":/components/icon";
import { DurationBar } from "../../components/duration-bar/DurationBar";
import { PlayerPreviewControls } from "../../components/controls/PreviewControls";

interface VideoPlayerProps {
  src: string;
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
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
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
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showStatusIcon, setShowStatusIcon] = useState(false);
  const [statusIcon, setStatusIcon] = useState<"play" | "pause">("play");

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
      setDuration(videoRef.current.duration);
      videoRef.current.controls = false;
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
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
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

  return (
    <div className={clsx("video-player", className)} style={{ width, height }}>
      <div
        className="video-player__video__wrapper"
        onMouseLeave={() => setShowStatusIcon(false)}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          controls={false}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onVolumeChange={handleVolumeInput}
          onClick={togglePlay}
          className="video-player__video"
          onLoadStart={handleLoadStart}
        />
        {showStatusIcon && (
          <div className="video-player__status-icon">
            <Icon name={statusIcon === "play" ? "play_arrow" : "pause"} />
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
};
