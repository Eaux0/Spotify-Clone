package io.music.search.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.Table;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "SongsToUser")
public class SongsToUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long songsToUserId;

    @Column(name = "song_id")
    private Long songId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "is_primary_artist")
    private Boolean isPrimaryArtist;

}
