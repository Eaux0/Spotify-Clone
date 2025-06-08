package io.music.search.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.music.search.models.SongsToUser;
import io.music.search.repository.SongsToUserRepository;

@Service
public class SongsToUserService {
    @Autowired
    private SongsToUserRepository songsToUserRepository;

    public SongsToUser getSongByPrimaryArtist(Long songId) {
        return songsToUserRepository.getPrimaryArtistofSong(songId);
    }

}
