import React, { useState, useEffect } from "react";
import "../styles/PlaylistModal.css";
import axios from "axios";

interface Song {
  songId: number;
  name: string;
  artist: string;
  totalPlays: number;
}

interface PlaylistData {
  id?: number;
  name: string;
  totalPlays: number;
  tracks?: Song[];
}

interface SearchResult {
  songs: Song[];
}

const fetchSearchResults = async (query: string): Promise<SearchResult> => {
  try {
    const response = await axios.get<SearchResult>(
      `http://localhost:8083/api/search?q=${encodeURIComponent(query)}`
    );
    return {
      songs: response.data.songs || [],
    };
  } catch (error) {
    console.error("Error fetching search results:", error);
    return { songs: [] };
  }
};

interface DetailsPlaylistPanelProps {
  playlist: PlaylistData;
  onBack: () => void;
  onPlaySong: (song: Song) => void;
  onPlayAll?: (songs: Song[]) => void;
  onAddToQueue?: (song: Song) => void;
  onAddNewSong?: (song: Song) => void;
}

const DetailsPlaylistPanel: React.FC<DetailsPlaylistPanelProps> = ({
  playlist,
  onBack,
  onPlaySong,
  onPlayAll,
  onAddToQueue,
  onAddNewSong,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [playlistTracks, setPlaylistTracks] = useState<Song[]>([]);

  // ✅ Fetch playlist songs from backend
  useEffect(() => {
    if (!playlist?.id) return;

    //const token = localStorage.getItem("jwt"); // 🔐 Assumes JWT is stored here

    axios
      .get(`http://localhost:8084/api/playlists/${playlist.id}/songs`)
      .then((response) => {
        setPlaylistTracks(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch playlist songs:", error);
        setPlaylistTracks([]);
      });
  }, [playlist?.id]);

  // Play all songs
  const handlePlayAll = () => {
    if (onPlayAll) onPlayAll(playlistTracks);
  };

  // Open/close modal
  const openModal = () => {
    setSearchTerm("");
    setFilteredSongs([]);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (searchTerm.length >= 1) {
      fetchSearchResults(searchTerm).then((data) => {
        setFilteredSongs(data.songs);
      });
    }
  }, [searchTerm]);

  // Add song to playlist via API
  const handleSongClick = async (song: Song) => {
    if (!playlist.id) return;
    const alreadyInPlaylist = playlistTracks.some(
      (s) => s.songId === song.songId
    );

    const token = localStorage.getItem("jwt"); // 🔐 Assumes JWT is stored here
    if (alreadyInPlaylist) {
      throw new Error("Song is already in the playlist.");
    }
    try {
      const response = await fetch(
        `http://localhost:8084/api/playlists/${playlist.id}/songs/${song.songId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add song");
      }

      if (
        !playlistTracks.some(
          (s) => s.name === song.name && s.artist === song.artist
        )
      ) {
        setPlaylistTracks((prev) => [...prev, song]);
      }

      if (onAddNewSong) onAddNewSong(song);
      closeModal();
    } catch (error) {
      console.error("Error adding song:", error);
      alert("Failed to add song to playlist. Please try again.");
    }
  };

  return (
    <div className="details-panel">
      <button onClick={onBack} className="btn btn-secondary mb-2">
        ← Back
      </button>

      <h2>PLAYLIST DETAILS</h2>
      <h4>{playlist.name}</h4>
      <p>Total Plays: {playlist.totalPlays}</p>

      <button className="btn btn-primary mb-3" onClick={handlePlayAll}>
        ▶ Play All
      </button>

      <button className="btn btn-outline-primary mb-3" onClick={openModal}>
        + Add New Song
      </button>

      <div className="queue-list">
        {playlistTracks.length === 0 ? (
          <p>No songs in this playlist.</p>
        ) : (
          playlistTracks.map((song, index) => (
            <div key={index} className="queue-tile">
              <div className="tile-text">
                <div className="tile-name">{song.name}</div>
                <div className="tile-plays">
                  {song.artist} • {(song.totalPlays ?? 0).toLocaleString()}{" "}
                  plays
                </div>
              </div>

              <div
                className="tile-actions"
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <button
                  className="player-btn"
                  onClick={() => onPlaySong(song)}
                  title="Play Song"
                >
                  ▶
                </button>

                {onAddToQueue && (
                  <button
                    className="player-btn"
                    onClick={() => onAddToQueue(song)}
                    title="Add to Queue"
                  >
                    ➕
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-window">
            <h3>Search and Add Song</h3>
            <input
              type="text"
              placeholder="Search songs or artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "10px",
                fontSize: "1rem",
              }}
              autoFocus
            />

            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
              {filteredSongs.length === 0 && searchTerm.trim() !== "" && (
                <p>No songs found.</p>
              )}
              {filteredSongs.map((song, index) => (
                <div
                  key={index}
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid #ccc",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSongClick(song)}
                  title={`Add "${song.name}" by ${song.artist} to playlist`}
                >
                  <strong>{song.name}</strong> — {song.artist}
                </div>
              ))}
            </div>

            <button className="btn btn-secondary mt-3" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsPlaylistPanel;
