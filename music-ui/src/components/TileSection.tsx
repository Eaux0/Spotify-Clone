import React from "react";
import Tile from "./Tile";

interface TileItem {
  name: string;
  totalPlays: number;
  id?: number; // ✅ allow playlists to pass an id
  artist?: string; // optional, for future use if needed
}

interface TileSectionProps {
  title: string;
  items: TileItem[];
  onItemClick?: (item: TileItem) => void;
}

const TileSection: React.FC<TileSectionProps> = ({
  title,
  items,
  onItemClick,
}) => {
  return (
    <section className="section-block">
      <div className="tile-scroll-container">
        <div className="tile-grid">
          {items.map((item, index) => (
            <Tile
              key={index}
              name={item.name}
              totalPlays={item.totalPlays}
              onClick={() => onItemClick && onItemClick(item)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TileSection;
