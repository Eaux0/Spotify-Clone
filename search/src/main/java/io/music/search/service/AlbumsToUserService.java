package io.music.search.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.music.search.models.AlbumsToUser;
import io.music.search.repository.AlbumsToUserRepository;

@Service
public class AlbumsToUserService {

    @Autowired
    private AlbumsToUserRepository albumsToUserRepository;

    public AlbumsToUser getArtistFromAlbum(Long albumId) {
        return albumsToUserRepository.getPrimaryArtistofAlbum(albumId);
    }

}
