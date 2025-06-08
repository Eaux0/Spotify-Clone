package io.music.songs_and_albums.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import io.music.songs_and_albums.models.SongsToUser;
import java.util.List;

public interface SongsToUserRepository extends JpaRepository<SongsToUser, Long> {
    List<SongsToUser> findBySongId(Long songId);

    List<SongsToUser> findByUserId(Long userId);
}
