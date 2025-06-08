package io.music.playlists.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.music.playlists.model.Playlist;
import io.music.playlists.repository.PlaylistRepository;

@Service
public class PlaylistService {

    @Autowired
    PlaylistRepository playlistRepository;

    public List<Playlist> getAllPlaylistsByUser(Long userId) {
        return playlistRepository.findByUserId(userId);
    }

    public Playlist getPlaylistById(Long playlistId) {
        return playlistRepository.findByPlaylistId(playlistId);
    }

    public List<Playlist> getPlayListByName(String name) {
        return playlistRepository.findByName(name);
    }

    public Playlist createPlaylist(Playlist playlist) {
        return playlistRepository.save(playlist);
    }

    public void deletePlaylist(Playlist playlist) {
        playlistRepository.delete(playlist);
    }

    public Playlist updatePlaylist(Playlist playlist) {
        return playlistRepository.save(playlist);
    }

}
