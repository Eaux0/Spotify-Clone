package io.music.songs_and_albums.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "AlbumsToUser")
public class AlbumsToUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long albumsToUserId;

    @Column(name = "album_id")
    private Long albumId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "is_primary_artist")
    private Boolean isPrimaryArtist;
}
