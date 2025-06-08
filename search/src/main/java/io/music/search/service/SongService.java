package io.music.search.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.music.search.models.Song;
import io.music.search.repository.SongRepository;

@Service
public class SongService {
    @Autowired
    private SongRepository songRepository;

    public List<Song> getSongByString(String name) {
        return songRepository.findByNameContainingIgnoreCase(name);
    }

}
