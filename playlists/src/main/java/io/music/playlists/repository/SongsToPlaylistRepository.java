package io.music.playlists.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import io.music.playlists.model.SongsToPlaylist;
import java.util.List;

public interface SongsToPlaylistRepository extends JpaRepository<SongsToPlaylist, Long> {
    List<SongsToPlaylist> findByPlayListId(Long playListId);
}
