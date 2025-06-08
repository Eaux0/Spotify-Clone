// UserHomePage.tsx
import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import TileSection from "../components/TileSection";
import Queue from "../components/Queue";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../index.css";
import DetailsAlbumPanel from "../DetailsPanel/DetailsAlbumPanel";
import DetailsPlaylistPanel from "../DetailsPanel/DetailsPlaylistPanel"; // <-- import new panel
import { useNavigate } from "react-router-dom";
import "../styles/DetailsAlbumPanel.css";
import axios from "axios";

interface UserHomePageProps {
  jwt: {
    token: string;
    username: string;
    name: string;
    role: string;
  };
  onLogout: () => void;
}

interface Song {
  name: string;
  artist?: string;
  totalPlays?: number;
}

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

const UserHomePage: React.FC<UserHomePageProps> = ({ jwt, onLogout }) => {
  const [selectedDetail, setSelectedDetail] = useState<
    | { type: "album"; data: any }
    | { type: "playlist"; data: any }
    | { type: "artist"; data: any }
    | null
  >(null);

  localStorage.setItem("jwt", jwt.token);

  const [allSongs, setAllSongs] = useState<any[]>([]);
  const [songs, setSongs] = useState<any[]>([]); // or type it better if you have DTO

  useEffect(() => {
    if (!jwt.token) {
      console.error("No JWT token available");
      return;
    }

    axios
      .get("http://localhost:8082/api/songs/user/me", {
        headers: { Authorization: `Bearer ${jwt.token}` },
      })
      .then((response) => {
        const fetchedSongs = response.data;
        setAllSongs(fetchedSongs);
        if (fetchedSongs.length > 10) {
          setSongs(fetchedSongs.slice(0, 10));
        } else {
          setSongs(fetchedSongs);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch songs with JWT:", error);
      });
  }, [jwt.token]);

  const [allAlbums, setAllAlbums] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]); // or type it better if you have DTO

  useEffect(() => {
    if (!jwt.token) {
      console.error("No JWT token available");
      return;
    }

    axios
      .get("http://localhost:8082/api/albums/user/me", {
        headers: { Authorization: `Bearer ${jwt.token}` },
      })
      .then((response) => {
        const fetchedAlbums = response.data;
        setAllAlbums(fetchedAlbums);
        if (fetchedAlbums.length > 10) {
          setAlbums(fetchedAlbums.slice(0, 10));
        } else {
          setAlbums(fetchedAlbums);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch songs with JWT:", error);
      });
  }, [jwt.token]);

  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8084/api/playlists",
          {
            headers: {
              Authorization: `Bearer ${jwt.token}`,
            },
            withCredentials: true, // Optional: if you're using cookies
          }
        );

        setPlaylists(response.data);
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      }
    };

    fetchPlaylists();
  }, [jwt.token]);

  const [queueItems, setQueueItems] = useState<Song[]>([]);
  const [history, setHistory] = useState<Song[]>([]);

  const addToQueue = (song: Song) => {
    setQueueItems((prev) => {
      const exists = prev.some(
        (s) => s.name === song.name && s.artist === song.artist
      );
      if (exists) return prev;
      return [...prev, song];
    });
  };

  const removeFromQueue = (index: number) => {
    setQueueItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    setQueueItems((prevQueue) => {
      if (prevQueue.length === 0) return prevQueue;

      const [firstSong, ...restQueue] = prevQueue;

      setHistory((prevHistory) => {
        if (prevHistory.length > 0 && prevHistory[0].name === firstSong.name)
          return prevHistory;
        return [firstSong, ...prevHistory];
      });

      return restQueue;
    });
  };

  const handlePrev = () => {
    setHistory((prevHistory) => {
      if (prevHistory.length === 0) return prevHistory;

      const [lastRemoved, ...restHistory] = prevHistory;

      setQueueItems((prevQueue) => {
        if (prevQueue.length > 0 && prevQueue[0].name === lastRemoved.name)
          return prevQueue;
        return [lastRemoved, ...prevQueue];
      });

      return restHistory;
    });
  };

  const navigate = useNavigate();

  const goToLogin = () => navigate("/login");

  return (
    <div className="page-container">
      <NavBar
        isLoggedIn={true}
        onLoginClick={goToLogin}
        onLogoutClick={() => {
          onLogout();
          navigate("/anon");
        }}
        setPlaylists={setPlaylists}
        setAlbum={setAlbums}
      />
      <div className="main-content-container">
        <div className="main-left-scroll-wrapper">
          <div className="main-left">
            {selectedDetail ? (
              selectedDetail.type === "album" ? (
                <DetailsAlbumPanel
                  album={selectedDetail.data}
                  onBack={() => setSelectedDetail(null)}
                  onPlayAll={(songs) => {
                    setQueueItems(songs);
                    setHistory([]);
                  }}
                  onAddToQueue={addToQueue}
                />
              ) : selectedDetail.type === "playlist" ? (
                <DetailsPlaylistPanel
                  playlist={selectedDetail.data}
                  onBack={() => setSelectedDetail(null)}
                  onPlaySong={(song) => addToQueue(song)} // Play song = add to queue
                  onPlayAll={(songs) => {
                    setQueueItems(songs);
                    setHistory([]);
                  }}
                />
              ) : (
                // For now just a placeholder for other types
                <div>
                  <button
                    className="btn btn-secondary mb-2"
                    onClick={() => setSelectedDetail(null)}
                  >
                    ← Back
                  </button>
                  <h2>{selectedDetail.type.toUpperCase()} DETAILS</h2>
                  <p>
                    Details panel for {selectedDetail.type} is not implemented
                    yet.
                  </p>
                </div>
              )
            ) : (
              <>
                <TileSection
                  title="Top Playlists"
                  items={playlists}
                  onItemClick={(playlist) =>
                    setSelectedDetail({ type: "playlist", data: playlist })
                  }
                />
                <TileSection
                  title="Top Songs"
                  items={songs.map((song) => ({
                    ...song,
                    totalPlays: song.totalPlays ?? 0, // ensure it's a number
                  }))}
                  onItemClick={addToQueue}
                />
                <TileSection
                  title="Top Albums"
                  items={albums}
                  onItemClick={(album) =>
                    setSelectedDetail({ type: "album", data: album })
                  }
                />
              </>
            )}
          </div>
        </div>

        <div className="main-right-fixed">
          <Queue
            queueItems={queueItems}
            onRemove={removeFromQueue}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>
      </div>
    </div>
  );
};

export default UserHomePage;
