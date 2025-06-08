// components/DetailsArtistPanel.tsx
import React, { useState } from "react";
import DetailsAlbumPanel from "./DetailsAlbumPanel";

interface Song {
  name: string;
  artist: string;
  plays: number;
}

interface Album {
  id: number;
  name: string;
  totalPlays: number;
  tracks?: Song[];
}

interface DetailsArtistPanelProps {
  artistName: string;
  onBack: () => void;
  onPlayAll?: (songs: Song[]) => void;
  onAddToQueue: (song: Song) => void;
}

const DetailsArtistPanel: React.FC<DetailsArtistPanelProps> = ({
  artistName,
  onBack,
  onPlayAll,
  onAddToQueue,
}) => {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const songs: Song[] = Array.from({ length: 5 }, (_, i) => ({
    name: `${artistName} - Song ${i + 1}`,
    artist: artistName,
    plays: Math.floor(Math.random() * 100000),
  }));

  const albums: Album[] = Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    name: `${artistName} Album ${i + 1}`,
    totalPlays: Math.floor(Math.random() * 500000),
    tracks: [
      {
        name: `${artistName} Album ${i + 1} - Track 1`,
        artist: artistName,
        plays: 1000,
      },
      {
        name: `${artistName} Album ${i + 1} - Track 2`,
        artist: artistName,
        plays: 2000,
      },
      {
        name: `${artistName} Album ${i + 1} - Track 3`,
        artist: artistName,
        plays: 3000,
      },
    ],
  }));

  const handlePlayAll = () => {
    if (onPlayAll) onPlayAll(songs);
  };

  if (selectedAlbum) {
    return (
      <DetailsAlbumPanel
        album={selectedAlbum}
        onBack={() => setSelectedAlbum(null)}
        onPlayAll={(songs) => {
          onPlayAll?.(songs);
        }}
        onAddToQueue={onAddToQueue}
      />
    );
  }

  return (
    <div className="details-panel">
      <button onClick={onBack} className="btn btn-secondary mb-2">
        ← Back
      </button>

      <h2>ARTIST DETAILS</h2>
      <h4>{artistName}</h4>

      <button className="btn btn-primary mb-3" onClick={handlePlayAll}>
        ▶ Play All Songs
      </button>

      <h5>Songs</h5>
      <div className="queue-list">
        {songs.map((song, index) => (
          <div key={index} className="queue-tile">
            <div className="tile-text">
              <div className="tile-name">{song.name}</div>
              <div className="tile-plays">
                {song.artist} • {song.plays.toLocaleString()} plays
              </div>
            </div>
            <div
              className="tile-actions"
              style={{ display: "flex", gap: "10px" }}
            >
              <button
                className="player-btn"
                onClick={() => onAddToQueue(song)}
                title="Add to Queue"
              >
                ➕
              </button>
            </div>
          </div>
        ))}
      </div>

      <h5 className="mt-4">Albums</h5>
      <div className="queue-list">
        {albums.map((album, index) => (
          <div
            key={index}
            className="queue-tile"
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedAlbum(album)}
            title="Click to view album"
          >
            <div className="tile-text">
              <div className="tile-name">{album.name}</div>
              <div className="tile-plays">
                {artistName} • {album.totalPlays.toLocaleString()} plays
              </div>
            </div>
            <div className="tile-actions">
              <span role="img" aria-label="Open Album">
                📀
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailsArtistPanel;
