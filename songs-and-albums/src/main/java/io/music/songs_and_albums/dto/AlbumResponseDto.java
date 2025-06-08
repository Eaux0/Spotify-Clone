package io.music.songs_and_albums.dto;

import java.util.Date;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AlbumResponseDto {
    private Long albumId;
    private Date createdAt;
    private String name;
    private Map<Long, Boolean> artistIdToPrimaryStatus;
    private Long totalPlays;
}
