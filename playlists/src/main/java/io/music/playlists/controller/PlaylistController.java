package io.music.playlists.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import io.music.playlists.dto.PlaylistRequestDto;
import io.music.playlists.model.Playlist;
import io.music.playlists.model.Song;
import io.music.playlists.model.SongsToPlaylist;
import io.music.playlists.security.JwtUtil;
import io.music.playlists.service.PlaylistService;
import io.music.playlists.service.SongsToPlaylistService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api")
public class PlaylistController {

    @Autowired
    private PlaylistService playlistService;
    @Autowired
    private SongsToPlaylistService songsToPlaylistService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/playlists")
    public List<Playlist> getAllPlaylists(HttpServletRequest request) {
        Long loggedInUserId = getUserIdFromToken(request);
        return playlistService.getAllPlaylistsByUser(loggedInUserId);
    }

    @GetMapping("/playlists/{id}")
    public Playlist getPlaylistById(HttpServletRequest request, @PathVariable("id") Long playlistId) {
        return playlistService.getPlaylistById(playlistId);
    }

    @GetMapping("/playlists/{id}/songs")
    public List<Song> getSongsByPlayList(HttpServletRequest request, @PathVariable("id") Long playlistId) {
        List<SongsToPlaylist> songsToPlaylists = songsToPlaylistService.getSongsByPlaylistId(playlistId);
        List<Song> songsInPlaylist = new ArrayList<>();

        for (int i = 0; i < songsToPlaylists.size(); i++) {
            Long songId = songsToPlaylists.get(i).getSongId();
            Song currSong = restTemplate.getForObject("http://localhost:8082/api/songs/" + songId, Song.class);
            songsInPlaylist.add(currSong);
        }
        return songsInPlaylist;
    }

    @PostMapping("/playlists/create")
    public Playlist createPlaylist(HttpServletRequest request, @RequestBody PlaylistRequestDto playlistRequestDto) {
        Playlist newCreatedPlaylist = new Playlist();
        newCreatedPlaylist.setCreatedAt(new Date());
        newCreatedPlaylist.setName(playlistRequestDto.getName());
        newCreatedPlaylist.setTotalPlays(0L);
        newCreatedPlaylist.setUserId(getUserIdFromToken(request));
        return playlistService.createPlaylist(newCreatedPlaylist);
    }

    @PostMapping("/playlists/{playlistId}/songs/{songId}")
    public SongsToPlaylist addSongToPlaylist(HttpServletRequest request, @PathVariable Long playlistId,
            @PathVariable Long songId) {
        SongsToPlaylist songsToPlaylist = new SongsToPlaylist();
        songsToPlaylist.setPlayListId(playlistId);
        songsToPlaylist.setSongId(songId);
        return songsToPlaylistService.addSongsToPlaylist(songsToPlaylist);
    }

    @DeleteMapping("/playlists/{playlistId}/songs/{songId}")
    public void deleteSongFromPlaylist(HttpServletRequest request, Long playlistId, Long songId) {
        List<SongsToPlaylist> songsToPlaylist = songsToPlaylistService.getSongsByPlaylistId(playlistId);
        for (int i = 0; i < songsToPlaylist.size(); i++) {
            if (songsToPlaylist.get(i).getSongId().equals(songId)) {
                songsToPlaylistService.deleteSongFromPlaylist(songsToPlaylist.get(i));
                break;
            }
        }
    }

    @DeleteMapping("/playlists/{playlistId}")
    public void deletePlaylist(HttpServletRequest request, Long playlistId) {
        List<SongsToPlaylist> songsToPlaylist = songsToPlaylistService.getSongsByPlaylistId(playlistId);
        for (int i = 0; i < songsToPlaylist.size(); i++)
            deleteSongFromPlaylist(request, playlistId, songsToPlaylist.get(i).getSongId());
        playlistService.deletePlaylist(playlistService.getPlaylistById(playlistId));
    }

    @PutMapping("/playlists/{playlistId}")
    public Playlist updatePlaylist(HttpServletRequest request, @RequestBody PlaylistRequestDto playlistRequestDto,
            Long playlistId) {
        Playlist currPlaylist = playlistService.getPlaylistById(playlistId);
        currPlaylist.setName(playlistRequestDto.getName());
        return playlistService.updatePlaylist(currPlaylist);
    }

    public Long getUserIdFromToken(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        if (token == null || !jwtUtil.isTokenValid(token)) {
            throw new RuntimeException("Invalid or missing token");
        }

        return jwtUtil.extractUserId(token);
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}
