import React, { useState, useEffect } from "react";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";
import "../styles/Player.css";

interface PlayerProps {
  currentSong?: { name: string; artist?: string };
  queueLength: number;
  onPrev: () => void;
  onNext: () => void;
}

const Player: React.FC<PlayerProps> = ({
  currentSong,
  queueLength,
  onPrev,
  onNext,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setProgress(0);
    setIsPlaying(false);
  }, [currentSong]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(intervalRef.current!);
            onNext();
            return 0;
          }
          return prev + 1;
        });
      }, 500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, onNext]);

  const togglePlayPause = () => {
    if (!currentSong) return;
    setIsPlaying((prev) => !prev);
  };

  const onSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(e.target.value));
  };

  return (
    <div className="player-container">
      <div className="player-info">
        <div className="player-song-name">
          {currentSong?.name || "Nothing Playing"}
        </div>
        <div className="player-artist-name">{currentSong?.artist || ""}</div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={progress}
        onChange={onSliderChange}
        className="player-slider"
      />
      <div className="player-controls">
        <button
          onClick={onPrev}
          disabled={queueLength <= 1}
          className="player-btn"
        >
          <FaStepBackward />
        </button>
        <button
          onClick={togglePlayPause}
          disabled={!currentSong}
          className="player-btn"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button
          onClick={onNext}
          disabled={queueLength <= 1}
          className="player-btn"
        >
          <FaStepForward />
        </button>
      </div>
    </div>
  );
};

export default Player;
