package io.music.search.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import io.music.search.models.Album;

public interface AlbumRepository extends JpaRepository<Album, Long> {
    public List<Album> findByNameContainingIgnoreCase(String name);
}
