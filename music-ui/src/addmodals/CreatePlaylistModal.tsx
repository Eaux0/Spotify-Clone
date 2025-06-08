import React, { useState } from "react";
import axios from "axios";

interface Playlist {
  id: number;
  name: string;
  totalPlays: number;
  tracks: {
    name: string;
    artist: string;
    plays: number;
  }[];
}

interface CreatePlaylistModalProps {
  onClose: () => void;
  setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>; // Add this line
}

const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  onClose,
  setPlaylists,
}) => {
  const [playlistName, setPlaylistName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.post(
        "http://localhost:8084/api/playlists/create",
        { name: playlistName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Playlist created:", response.data);

      // Directly update playlists in the parent component
      setPlaylists((prevPlaylists) => [...prevPlaylists, response.data]);

      onClose(); // Close modal after success
    } catch (err) {
      console.error("Error creating playlist:", err);
      setError("Failed to create playlist. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-body">
        <div className="mb-3">
          <label htmlFor="playlistName" className="form-label">
            Playlist Name
          </label>
          <input
            id="playlistName"
            type="text"
            className="form-control"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            required
            autoFocus
          />
        </div>
        {error && <div className="text-danger">{error}</div>}
      </div>

      <div className="modal-footer">
        <button type="submit" className="btn btn-primary">
          Add Playlist
        </button>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreatePlaylistModal;
