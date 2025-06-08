import React, { useState, useEffect } from "react";
import axios from "axios";

interface Album {
  albumId: number;
  name: string;
}

interface AddSongModalProps {
  onClose: () => void;
}

const AddSongModal: React.FC<AddSongModalProps> = ({ onClose }) => {
  const [songName, setSongName] = useState("");
  const [albumQuery, setAlbumQuery] = useState(""); // Search query for albums
  const [albums, setAlbums] = useState<Album[]>([]); // List of albums from search
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | "">(""); // Selected album ID
  const [error, setError] = useState<string>("");

  // Fetch albums based on search query
  useEffect(() => {
    if (albumQuery.length > 2) {
      // Trigger search only when user types more than 2 characters
      const fetchSearchResults = async (query: string) => {
        try {
          const response = await axios.get(
            `http://localhost:8083/api/search?q=${encodeURIComponent(query)}`
          );
          setAlbums(response.data.albums || []);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };

      fetchSearchResults(albumQuery);
    } else {
      setAlbums([]); // Clear albums if query is empty or too short
    }
  }, [albumQuery]);

  // Watch for changes in selectedAlbumId to debug
  useEffect(() => {
    console.log("Selected Album ID (via useEffect):", selectedAlbumId);
  }, [selectedAlbumId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Debugging selectedAlbumId
    console.log("Selected Album ID (in submit):", selectedAlbumId);
    console.log("Song Name:", songName);

    if (!songName || selectedAlbumId === "") {
      setError("Please enter a song name and select an album.");
      return;
    }

    const token = localStorage.getItem("jwt");
    if (!token) {
      setError("Authentication token missing.");
      return;
    }

    // Extract user ID from JWT for the primary artist (logged-in user)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const primaryArtistId = payload.userId;

    // Construct the SongRequestDto to send to the backend
    const songRequestDto = {
      name: songName,
      albumId: selectedAlbumId,
      artistIdToPrimaryStatus: {
        [primaryArtistId]: true, // Logged-in user is the primary artist
      },
    };
    console.log(songRequestDto);
    try {
      const response = await axios.post(
        "http://localhost:8082/api/songs/create",
        songRequestDto,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Song created:", response.data);
      onClose(); // Close the modal after successful creation
    } catch (err) {
      console.error("Error creating song:", err);
      setError("Failed to create song. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-body">
        {/* Song Name Input */}
        <div className="mb-3">
          <label htmlFor="songName" className="form-label">
            Song Name
          </label>
          <input
            id="songName"
            type="text"
            className="form-control"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            required
            autoFocus
          />
        </div>

        {/* Album Search & Select */}
        <div className="mb-3" style={{ position: "relative" }}>
          <label htmlFor="albumSelect" className="form-label">
            Search and Select Album
          </label>
          <input
            id="albumSelect"
            type="text"
            className="form-control"
            value={albumQuery}
            onChange={(e) => setAlbumQuery(e.target.value)}
            placeholder="Search for an album..."
            autoComplete="off"
          />
          {albums.length > 0 && (
            <div
              className="dropdown-menu show"
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                maxHeight: "200px",
                overflowY: "auto",
                zIndex: 1000,
              }}
            >
              {albums.map((album) => (
                <a
                  key={album.albumId} // Ensure each item has a unique key
                  href="#"
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent page jump

                    // Debugging the album id selection
                    console.log(
                      "Selected Album ID from dropdown:",
                      album.albumId
                    );

                    setSelectedAlbumId(album.albumId); // Set the selected album ID
                    setAlbumQuery(album.name); // Set the album name in the search query
                    setAlbums([]); // Clear the search results after selection
                  }}
                >
                  {album.name}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && <div className="alert alert-danger">{error}</div>}
      </div>

      <div className="modal-footer">
        <button type="submit" className="btn btn-primary">
          Add Song
        </button>
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddSongModal;
