package io.music.playlists.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import io.music.playlists.model.Playlist;
import java.util.List;

public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    List<Playlist> findByUserId(Long userId);

    @Query(value = "select * from public.playlist where playlist_id=:playlistId", nativeQuery = true)
    Playlist findByPlaylistId(@Param("playlistId") Long playlistId);

    List<Playlist> findByName(String name);
}
