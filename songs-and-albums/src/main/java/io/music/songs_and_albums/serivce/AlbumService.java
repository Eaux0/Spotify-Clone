package io.music.songs_and_albums.serivce;

import io.music.songs_and_albums.models.Album;
import io.music.songs_and_albums.repository.AlbumRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AlbumService {

    @Autowired
    private AlbumRepository albumRepository;

    public Album getAlbumByAlbumId(Long albumId) {
        return albumRepository.findByAlbumId(albumId);
    }

    public List<Album> getAlbumByName(String name) {
        return albumRepository.findByName(name);
    }

    public Album saveAlbum(Album album) {
        return albumRepository.save(album);
    }

    public void deleteAlbum(Long albumId) {
        albumRepository.deleteById(albumId);
    }

    public Album updateAlbum(Album album) {
        return albumRepository.save(album);
    }

    public List<Album> findAlbumsByUserId(Long userId) {
        return albumRepository.findAlbumsByUserId(userId);
    }

    public List<Album> findTopAlbums() {
        return albumRepository.findTopAlbums();
    }
}
