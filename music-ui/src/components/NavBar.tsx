import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/NavBar.css";
import AddSongModal from "../addmodals/AddSongModal";
import CreatePlaylistModal from "../addmodals/CreatePlaylistModal";
import AddAlbumModal from "../addmodals/AddAlbumModal";
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

interface Album {
  id: number;
  name: string;
}

interface NavBarProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;
  setAlbum: React.Dispatch<React.SetStateAction<Album[]>>;
}

interface SearchResult {
  songs: { name: string; artist: string }[];
  albums: { id: number; name: string; totalPlays: number }[];
  users: { name: string }[];
}

const fetchSearchResults = async (query: string): Promise<SearchResult> => {
  try {
    const response = await axios.get<SearchResult>(
      `http://localhost:8083/api/search?q=${encodeURIComponent(query)}`
    );
    return {
      songs: response.data.songs || [],
      albums: response.data.albums || [],
      users: response.data.users || [],
    };
  } catch (error) {
    console.error("Error fetching search results:", error);
    return { songs: [], albums: [], users: [] };
  }
};

const NavBar: React.FC<NavBarProps> = ({
  isLoggedIn,
  onLoginClick,
  onLogoutClick,
  setPlaylists,
  setAlbum,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [showAddSong, setShowAddSong] = useState(false);
  const [showAddAlbum, setShowAddAlbum] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length >= 1) {
      fetchSearchResults(query).then((data) => {
        setResults(data);
        setShowModal(true);
      });
    } else {
      setResults(null);
      setShowModal(false);
    }
  }, [query]);

  const closeModal = () => {
    setShowModal(false);
    setQuery("");
    setResults(null);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedOutsideDropdown =
        dropdownRef.current && !dropdownRef.current.contains(target);
      const clickedOutsideModal =
        modalWrapperRef.current && !modalWrapperRef.current.contains(target);

      if (clickedOutsideDropdown) setDropdownOpen(false);

      if (
        clickedOutsideDropdown &&
        clickedOutsideModal &&
        (showAddSong || showCreatePlaylist || showAddAlbum || showModal)
      ) {
        setShowAddSong(false);
        setShowCreatePlaylist(false);
        setShowAddAlbum(false);
        closeModal();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, showAddSong, showCreatePlaylist, showAddAlbum, showModal]);

  const toggleDropdown = () => setDropdownOpen((open) => !open);

  return (
    <>
      <header className="navbar">
        <div className="navbar-center position-relative">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search music, artists, albums..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="search-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="#b3b3b3"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398l3.85 3.85a1 1 0 1 0 1.415-1.415l-3.85-3.85zM6.5 10a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
              </svg>
            </span>
          </div>
        </div>

        <div
          ref={dropdownRef}
          className={`navbar-right dropdown ${dropdownOpen ? "show" : ""}`}
          style={{ position: "relative" }}
        >
          <button
            className="btn dropdown-toggle"
            type="button"
            aria-expanded={dropdownOpen}
            onClick={toggleDropdown}
          >
            <img src="anonUserPic.png" alt="User" className="user-avatar" />
          </button>
          <ul
            className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}
            aria-label="User menu"
          >
            {isLoggedIn ? (
              <>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setShowCreatePlaylist(true);
                      setDropdownOpen(false);
                    }}
                  >
                    Create Playlist
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setShowAddSong(true);
                      setDropdownOpen(false);
                    }}
                  >
                    Add Song
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setShowAddAlbum(true);
                      setDropdownOpen(false);
                    }}
                  >
                    Add Album
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      onLogoutClick();
                      setDropdownOpen(false);
                    }}
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    onLoginClick();
                    setDropdownOpen(false);
                  }}
                >
                  Sign In
                </button>
              </li>
            )}
          </ul>
        </div>
      </header>

      <div ref={modalWrapperRef}>
        {/* Add Song Modal */}
        {showAddSong && (
          <>
            <div
              className="modal fade show d-block"
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="addSongModalLabel"
              onClick={() => setShowAddSong(false)}
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content bg-dark text-white">
                  <div className="modal-header">
                    <h5 className="modal-title">Add Song</h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      aria-label="Close"
                      onClick={() => setShowAddSong(false)}
                    />
                  </div>
                  <AddSongModal onClose={() => setShowAddSong(false)} />
                </div>
              </div>
            </div>
            <div
              className="modal-backdrop fade show"
              onClick={() => setShowAddSong(false)}
            />
          </>
        )}

        {/* Create Playlist Modal */}
        {showCreatePlaylist && (
          <>
            <div
              className="modal fade show d-block"
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="addPlaylistModalLabel"
              onClick={() => setShowCreatePlaylist(false)}
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content bg-dark text-white">
                  <div className="modal-header">
                    <h5 className="modal-title">Add Playlist</h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      aria-label="Close"
                      onClick={() => setShowCreatePlaylist(false)}
                    />
                  </div>
                  <CreatePlaylistModal
                    setPlaylists={setPlaylists}
                    onClose={() => setShowCreatePlaylist(false)}
                  />
                </div>
              </div>
            </div>
            <div
              className="modal-backdrop fade show"
              onClick={() => setShowCreatePlaylist(false)}
            />
          </>
        )}

        {/* Add Album Modal */}
        {showAddAlbum && (
          <>
            <div
              className="modal fade show d-block"
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="addAlbumModalLabel"
              onClick={() => setShowAddAlbum(false)}
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content bg-dark text-white">
                  <div className="modal-header">
                    <h5 className="modal-title">Add Album</h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      aria-label="Close"
                      onClick={() => setShowAddAlbum(false)}
                    />
                  </div>
                  <AddAlbumModal
                    setAlbum={setAlbum}
                    onClose={() => setShowAddAlbum(false)}
                  />
                </div>
              </div>
            </div>
            <div
              className="modal-backdrop fade show"
              onClick={() => setShowAddAlbum(false)}
            />
          </>
        )}

        {/* Search Results Modal */}
        {showModal && results && (
          <>
            <div
              className="modal fade show d-block"
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="searchResultsModalLabel"
            >
              <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content bg-dark text-white">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      Search Results for "{query}"
                    </h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      aria-label="Close"
                      onClick={closeModal}
                    />
                  </div>
                  <div className="modal-body">
                    <div className="search-results-section">
                      <h6>Songs</h6>
                      {results?.songs?.length ? (
                        results.songs.map((song, i) => (
                          <div key={i} className="search-tile">
                            <div>
                              <div className="tile-name">{song.name}</div>
                              <div className="tile-info">{song.artist}</div>
                            </div>
                            <div
                              title="Add to queue"
                              style={{ cursor: "pointer" }}
                            >
                              ➕
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>No songs found.</div>
                      )}
                    </div>

                    <div className="search-results-section">
                      <h6>Albums</h6>
                      {results?.albums?.length ? (
                        results.albums.map((album, i) => (
                          <div key={i} className="search-tile">
                            <div>
                              <div className="tile-name">{album.name}</div>
                              <div className="tile-info">
                                {album.totalPlays.toLocaleString()} plays
                              </div>
                            </div>
                            <div
                              title="View album"
                              style={{ cursor: "pointer" }}
                            >
                              📀
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>No albums found.</div>
                      )}
                    </div>

                    <div className="search-results-section">
                      <h6>Artists</h6>
                      {results?.users?.length ? (
                        results.users.map((users, i) => (
                          <div key={i} className="search-tile">
                            <div className="tile-name">{users.name}</div>
                            <div
                              title="View artist"
                              style={{ cursor: "pointer" }}
                            >
                              🎤
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>No artists found.</div>
                      )}
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={closeModal}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show" onClick={closeModal} />
          </>
        )}
      </div>
    </>
  );
};

export default NavBar;
