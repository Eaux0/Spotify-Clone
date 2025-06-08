package io.music.songs_and_albums.serivce;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.music.songs_and_albums.models.Song;
import io.music.songs_and_albums.repository.SongRepository;

@Service
public class SongService {

    @Autowired
    private SongRepository songRepository;

    public List<Song> getSongsByAlbumId(Long albumId) {
        return songRepository.findByAlbumId(albumId);
    }

    public Song getSongBySongId(Long songId) {
        return songRepository.findBySongId(songId);
    }

    public List<Song> getSongByName(String name) {
        return songRepository.findByName(name);
    }

    public Song saveSong(Song song) {
        return songRepository.save(song);
    }

    public void deleteSong(Long songId) {
        songRepository.deleteById(songId);
    }

    public Song updateSong(Song song) {
        return songRepository.save(song);
    }

    public List<Song> findSongsByUserId(Long userId) {
        return songRepository.findSongsByUserId(userId);
    }

    public List<Song> findTopSongs() {
        return songRepository.findTopSongs();
    }
}
