import React from "react";
import QueueTile from "./QueueTile";
import Player from "./Player";

import "../styles/Queue.css";

interface QueueProps {
  queueItems: { name: string; artist?: string }[];
  onRemove: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

const Queue: React.FC<QueueProps> = ({
  queueItems,
  onRemove,
  onPrev,
  onNext,
}) => {
  const isEmpty = queueItems.length === 0;

  return (
    <div className={`queue-container ${isEmpty ? "empty-queue" : ""}`}>
      {isEmpty ? (
        <div className="nothing-playing">Nothing Playing</div>
      ) : (
        <div className="queue-content">
          <div className="queue-list">
            {queueItems.map((item, index) => (
              <QueueTile
                key={`${item.name}-${index}`}
                name={item.name}
                artist={item.artist}
                isPlaying={index === 0}
                isRemovable={index !== 0}
                onRemove={() => onRemove(index)}
              />
            ))}
          </div>
          <Player
            currentSong={queueItems[0]}
            queueLength={queueItems.length}
            onPrev={onPrev}
            onNext={onNext}
          />
        </div>
      )}
    </div>
  );
};

export default Queue;
