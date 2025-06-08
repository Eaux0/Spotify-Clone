package io.music.songs_and_albums.dto;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AlbumRequestDto {
    private String name;
    private Map<Long, Boolean> artistIdToPrimaryStatus;
}
