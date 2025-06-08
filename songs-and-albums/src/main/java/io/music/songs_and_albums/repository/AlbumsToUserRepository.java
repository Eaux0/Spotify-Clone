package io.music.songs_and_albums.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import io.music.songs_and_albums.models.AlbumsToUser;
import java.util.List;

public interface AlbumsToUserRepository extends JpaRepository<AlbumsToUser, Long> {
    List<AlbumsToUser> findByAlbumId(Long albumId);

    List<AlbumsToUser> findByUserId(Long userId);
}
