package io.music.playlists.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.music.playlists.model.SongsToPlaylist;
import io.music.playlists.repository.SongsToPlaylistRepository;

@Service
public class SongsToPlaylistService {

    @Autowired
    SongsToPlaylistRepository songsToPlaylistRepository;

    public List<SongsToPlaylist> getSongsByPlaylistId(Long playlistId) {
        return songsToPlaylistRepository.findByPlayListId(playlistId);
    }

    public SongsToPlaylist addSongsToPlaylist(SongsToPlaylist songsToPlaylist) {
        return songsToPlaylistRepository.save(songsToPlaylist);
    }

    public void deleteSongFromPlaylist(SongsToPlaylist songsToPlaylist) {
        songsToPlaylistRepository.delete(songsToPlaylist);
    }

}
