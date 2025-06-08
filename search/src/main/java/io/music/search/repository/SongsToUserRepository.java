package io.music.search.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import io.music.search.models.SongsToUser;

public interface SongsToUserRepository extends JpaRepository<SongsToUser, Long> {

    @Query(value = "select * from public.songs_to_user where song_id=:songId and is_primary_artist=true", nativeQuery = true)
    SongsToUser getPrimaryArtistofSong(@Param("songId") Long songId);
}
