package io.music.search.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.music.search.models.Album;
import io.music.search.repository.AlbumRepository;

@Service
public class AlbumService {
    @Autowired
    private AlbumRepository albumRepository;

    public List<Album> getAlbumByString(String name) {
        return albumRepository.findByNameContainingIgnoreCase(name);
    }
}
