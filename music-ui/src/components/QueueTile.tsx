import React, { useState } from "react";
import { FaPlay, FaTimes } from "react-icons/fa";
import "../styles/QueueTile.css";

interface QueueTileProps {
  name: string;
  artist?: string;
  isPlaying?: boolean;
  isRemovable?: boolean;
  onRemove?: () => void;
}

const QueueTile: React.FC<QueueTileProps> = ({
  name,
  artist,
  isPlaying,
  isRemovable,
  onRemove,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="queue-tile"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="tile-text">
        <div className="tile-name">{name}</div>
        <div className="tile-plays">{artist ?? "Unknown Artist"}</div>
      </div>

      {isPlaying && <FaPlay className="play-icon" />}
      {isRemovable && hovered && (
        <FaTimes className="remove-icon" onClick={onRemove} />
      )}
    </div>
  );
};

export default QueueTile;
