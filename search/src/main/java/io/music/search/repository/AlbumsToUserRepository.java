package io.music.search.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import io.music.search.models.AlbumsToUser;

public interface AlbumsToUserRepository extends JpaRepository<AlbumsToUser, Long> {

    @Query(value = "select * from public.albums_to_user where album_id=:albumId and is_primary_artist=true", nativeQuery = true)
    AlbumsToUser getPrimaryArtistofAlbum(@Param("albumId") Long songId);
}
