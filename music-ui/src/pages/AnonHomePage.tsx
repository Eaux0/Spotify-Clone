// pages/AnonHomePage.tsx
import React, { useState } from "react";
import { useEffect } from "react"; // already have useState
import NavBar from "../components/NavBar";
import TileSection from "../components/TileSection";
import Queue from "../components/Queue";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../index.css";
import "../styles/DetailsAlbumPanel.css"; // Can reuse existing styles
import { useNavigate } from "react-router-dom";
import DetailsAlbumPanel from "../DetailsPanel/DetailsAlbumPanel";
import DetailsArtistPanel from "../DetailsPanel/DetailsArtistPanel"; // <-- New import
import axios from "axios";

const AnonHomePage: React.FC = () => {
  const [selectedDetail, setSelectedDetail] = useState<
    | { type: "album"; data: any }
    | { type: "playlist"; data: any }
    | { type: "artist"; data: any }
    | null
  >(null);

  const [songs, setSongs] = useState<any[]>([]); // or type it better if you have DTO

  useEffect(() => {
    axios
      .get("http://localhost:8082/api/songs/top")
      .then((response) => {
        setSongs(response.data); // assuming response.data is an array
      })
      .catch((error) => {
        console.error("Failed to fetch top songs:", error);
      });
  }, []);

  const [albums, setAlbums] = useState<any[]>([]);
  useEffect(() => {
    axios
      .get("http://localhost:8082/api/albums/top")
      .then((response) => {
        setAlbums(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch top albums:", error);
      });
  }, []);

  const artists = Array.from({ length: 10 }, (_, i) => ({
    name: `Artist ${i + 1}`,
    totalPlays: Math.floor(Math.random() * 2000000),
  }));

  const [queueItems, setQueueItems] = useState<
    { name: string; artist?: string }[]
  >([]);
  const [history, setHistory] = useState<{ name: string; artist?: string }[]>(
    []
  );

  const addToQueue = (song: { name: string; artist?: string }) => {
    setQueueItems((prev) => {
      const exists = prev.some(
        (s) => s.name === song.name && s.artist === song.artist
      );
      if (exists) return prev;
      return [...prev, { name: song.name, artist: song.artist }];
    });
  };

  const removeFromQueue = (index: number) => {
    setQueueItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    setQueueItems((prevQueue) => {
      if (prevQueue.length === 0) return prevQueue;
      const [firstSong, ...restQueue] = prevQueue;
      setHistory((prevHistory) =>
        prevHistory.length > 0 && prevHistory[0].name === firstSong.name
          ? prevHistory
          : [firstSong, ...prevHistory]
      );
      return restQueue;
    });
  };

  const handlePrev = () => {
    setHistory((prevHistory) => {
      if (prevHistory.length === 0) return prevHistory;
      const [lastRemoved, ...restHistory] = prevHistory;
      setQueueItems((prevQueue) =>
        prevQueue.length > 0 && prevQueue[0].name === lastRemoved.name
          ? prevQueue
          : [lastRemoved, ...prevQueue]
      );
      return restHistory;
    });
  };

  const navigate = useNavigate();
  const goToLogin = () => navigate("/login");

  return (
    <div className="page-container">
      <NavBar
        isLoggedIn={false}
        onLoginClick={goToLogin}
        onLogoutClick={() => {}}
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
              ) : selectedDetail.type === "artist" ? (
                <DetailsArtistPanel
                  artistName={selectedDetail.data.name}
                  onBack={() => setSelectedDetail(null)}
                  onPlayAll={(songs) => {
                    setQueueItems(songs);
                    setHistory([]);
                  }}
                  onAddToQueue={addToQueue}
                />
              ) : null
            ) : (
              <>
                <TileSection
                  title="Top Songs"
                  items={songs}
                  onItemClick={addToQueue}
                />
                <TileSection
                  title="Top Albums"
                  items={albums}
                  onItemClick={
                    (album) => setSelectedDetail({ type: "album", data: album }) // `album` must include `id`
                  }
                />

                <TileSection
                  title="Top Artists"
                  items={artists}
                  onItemClick={(artist) =>
                    setSelectedDetail({ type: "artist", data: artist })
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

export default AnonHomePage;
