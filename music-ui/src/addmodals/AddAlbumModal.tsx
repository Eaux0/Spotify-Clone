import React, { useState, useEffect } from "react";
import axios from "axios";

interface Album {
  id: number;
  name: string;
}

interface AddAlbumModalProps {
  onClose: () => void;
  setAlbum: React.Dispatch<React.SetStateAction<Album[]>>;
}

const AddAlbumModal: React.FC<AddAlbumModalProps> = ({ onClose, setAlbum }) => {
  const [albumName, setAlbumName] = useState<string>(""); // Album name
  const [error, setError] = useState<string>("");

  // This useEffect is just to make sure we have the JWT when we submit the form
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      setError("Authentication token missing.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Check if album name is provided
    if (!albumName) {
      setError("Please enter an album name.");
      return;
    }

    const token = localStorage.getItem("jwt");
    if (!token) {
      setError("Authentication token missing.");
      return;
    }

    // Decode JWT to get user ID (primary artist)
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
    const primaryArtistId = payload.userId;

    // Construct the AlbumRequestDto
    const albumRequestDto = {
      name: albumName, // Use the album name entered by the user
      artistIdToPrimaryStatus: {
        [primaryArtistId]: true, // Hardcode the logged-in user as the primary artist
      },
    };

    try {
      const response = await axios.post(
        "http://localhost:8082/api/albums/create",
        albumRequestDto,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Album created:", response.data);
      setAlbum((prevAlbums) => [...prevAlbums, response.data]); // Add the new album to state
      onClose(); // Close modal after success
    } catch (err) {
      console.error("Error creating album:", err);
      setError("Failed to create album. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-body">
        <div className="mb-3">
          <label htmlFor="albumName" className="form-label">
            Album Name
          </label>
          <input
            id="albumName"
            type="text"
            className="form-control"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            required
            autoFocus
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
      </div>

      <div className="modal-footer">
        <button type="submit" className="btn btn-primary">
          Create Album
        </button>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddAlbumModal;
