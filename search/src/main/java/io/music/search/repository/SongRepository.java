package io.music.search.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import io.music.search.models.Song;

public interface SongRepository extends JpaRepository<Song, Long> {
    public List<Song> findByNameContainingIgnoreCase(String name);

}
