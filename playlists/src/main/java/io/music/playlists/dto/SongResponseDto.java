package io.music.playlists.dto;

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
public class SongResponseDto {
    private Long songId;
    private String name;
    private Long albumId;
    private Map<Long, Boolean> artistIdToPrimaryStatus;
    private Date createdAt;
    private Long totalPlays;
}
