// src/components/Tile.tsx
import React from "react";
import "../styles/Tile.css";
import { FaPlay } from "react-icons/fa";

interface TileProps {
  name: string;
  totalPlays: number;
  onClick?: () => void;
}

const Tile: React.FC<TileProps> = ({ name, totalPlays, onClick }) => {
  return (
    <div
      className="tile"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="tile-text">
        <div className="tile-name">{name}</div>
        <div className="tile-plays">
          {typeof totalPlays === "number"
            ? `${totalPlays.toLocaleString()} plays`
            : "Plays unknown"}
        </div>
      </div>
      <FaPlay className="play-icon" />
    </div>
  );
};

export default Tile;
