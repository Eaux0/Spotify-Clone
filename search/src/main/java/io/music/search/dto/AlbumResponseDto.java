package io.music.search.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AlbumResponseDto {
    private String name;
    private String artist;
    private Long totalPlays;
    private Long albumId;
}
