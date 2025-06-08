package io.music.songs_and_albums.serivce;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.music.songs_and_albums.models.SongsToUser;
import io.music.songs_and_albums.repository.SongsToUserRepository;

@Service
public class SongsToUserService {
    @Autowired
    private SongsToUserRepository songsToUserRepository;

    public List<SongsToUser> findBySongId(Long songId) {
        return songsToUserRepository.findBySongId(songId);
    }

    public List<SongsToUser> findByUserId(Long userId) {
        return songsToUserRepository.findByUserId(userId);

    }

    public SongsToUser saveSongsToUser(SongsToUser songsToUser) {
        return songsToUserRepository.save(songsToUser);
    }

    public void deleteSongsToUser(Long songsToUserId) {
        songsToUserRepository.deleteById(songsToUserId);
    }

}
