package io.music.songs_and_albums.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import io.music.songs_and_albums.models.Song;

public interface SongRepository extends JpaRepository<Song, Long> {
    Song findBySongId(Long songId);

    List<Song> findByAlbumId(Long albumId);

    List<Song> findByName(String name);

    @Query(value = "select * from public.songs order by total_plays desc limit 10", nativeQuery = true)
    public List<Song> findTopSongs();

    @Query(value = "select * from public.songs where user_id=:userId order by total_plays desc", nativeQuery = true)
    public List<Song> findSongsByUserId(@Param("userId") Long userId);

}
