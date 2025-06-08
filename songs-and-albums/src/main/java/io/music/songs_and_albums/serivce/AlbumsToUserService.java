package io.music.songs_and_albums.serivce;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.music.songs_and_albums.models.AlbumsToUser;
import io.music.songs_and_albums.repository.AlbumsToUserRepository;

@Service
public class AlbumsToUserService {

    @Autowired
    private AlbumsToUserRepository albumsToUserRepository;

    public List<AlbumsToUser> findByAlbumId(Long albumId) {
        return albumsToUserRepository.findByAlbumId(albumId);
    }

    public List<AlbumsToUser> findByUserId(Long userId) {
        return albumsToUserRepository.findByUserId(userId);
    }

    public AlbumsToUser saveAlbumsToUser(AlbumsToUser atu) {
        return albumsToUserRepository.save(atu);
    }

    public void deleteAlbumsToUser(Long albumsToUserId) {
        albumsToUserRepository.deleteById(albumsToUserId);
    }
}
