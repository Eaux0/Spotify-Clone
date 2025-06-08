package io.music.songs_and_albums.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import io.music.songs_and_albums.models.Album;

public interface AlbumRepository extends JpaRepository<Album, Long> {

    Album findByAlbumId(Long albumId);

    List<Album> findByName(String name);

    @Query(value = "select * from public.albums where user_id=:userId order by total_plays desc", nativeQuery = true)
    public List<Album> findAlbumsByUserId(@Param("userId") Long userId);

    @Query(value = "select * from public.albums order by total_plays desc limit 10", nativeQuery = true)
    public List<Album> findTopAlbums();

}
