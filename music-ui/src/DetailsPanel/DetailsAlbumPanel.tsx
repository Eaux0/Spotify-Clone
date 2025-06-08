import React, { useEffect, useState } from "react";
import axios from "axios";

interface Song {
  name: string;
  artist: string;
  totalPlays: number;
}

interface AlbumData {
  albumId: string;
  name: string;
  totalPlays: number;
  // tracks?: Song[]; // remove this since we'll fetch them
}

interface DetailsAlbumPanelProps {
  album?: AlbumData;
  onBack: () => void;
  onPlayAll?: (songs: Song[]) => void;
  onAddToQueue: (song: Song) => void;
}

const DetailsAlbumPanel: React.FC<DetailsAlbumPanelProps> = ({
  album,
  onBack,
  onPlayAll,
  onAddToQueue,
}) => {
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!album?.albumId) return;

    setLoading(true);
    axios
      .get(`http://localhost:8082/api/albums/${album.albumId}/songs`)
      .then((response) => {
        setSongs(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch album songs:", error);
        setSongs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [album?.albumId]);

  const handlePlayAll = () => {
    if (songs && onPlayAll) onPlayAll(songs);
  };

  if (!album) {
    return (
      <div className="details-panel">
        <p>Loading album details...</p>
      </div>
    );
  }

  return (
    <div className="details-panel">
      <button onClick={onBack} className="btn btn-secondary mb-2">
        ← Back
      </button>

      <h2>ALBUM DETAILS</h2>
      <h4>{album.name}</h4>
      <p>
        Total Plays:{" "}
        {typeof album.totalPlays != null ? album.totalPlays : "N/A"}{" "}
      </p>

      <button
        className="btn btn-primary mb-3"
        onClick={handlePlayAll}
        disabled={!songs || songs.length === 0}
      >
        ▶ Play All
      </button>

      {loading ? (
        <p>Loading tracks...</p>
      ) : songs?.length === 0 ? (
        <p>No songs found for this album.</p>
      ) : (
        <div className="queue-list">
          {songs!.map((song, index) => (
            <div key={index} className="queue-tile">
              <div className="tile-text">
                <div className="tile-name">{song.name}</div>
                <div className="tile-plays">
                  {typeof song.totalPlays != null ? song.totalPlays : "N/A"}{" "}
                  plays
                </div>
              </div>
              <div
                className="tile-actions"
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <button
                  className="player-btn"
                  onClick={() => onAddToQueue(song)}
                  title="Add to Queue"
                >
                  ➕
                </button>
                <button
                  className="player-btn"
                  onClick={() =>
                    alert("Add to Playlist clicked (not implemented)")
                  }
                  title="Add to Playlist"
                >
                  📂
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailsAlbumPanel;
