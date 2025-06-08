package io.music.songs_and_albums.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import io.music.songs_and_albums.dto.AlbumResponseDto;
import io.music.songs_and_albums.dto.AlbumRequestDto;
import io.music.songs_and_albums.dto.SongRequestDto;
import io.music.songs_and_albums.dto.SongResponseDto;
import io.music.songs_and_albums.models.Album;
import io.music.songs_and_albums.models.AlbumsToUser;
import io.music.songs_and_albums.models.Song;
import io.music.songs_and_albums.models.SongsToUser;
import io.music.songs_and_albums.security.JwtUtil;
import io.music.songs_and_albums.serivce.AlbumService;
import io.music.songs_and_albums.serivce.AlbumsToUserService;
import io.music.songs_and_albums.serivce.SongService;
import io.music.songs_and_albums.serivce.SongsToUserService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api")
public class SongAndAlbumController {

    @Autowired
    private SongService songService;

    @Autowired
    private AlbumService albumService;

    @Autowired
    private AlbumsToUserService albumsToUserService;

    @Autowired
    private SongsToUserService songsToUserService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/albums/user/me")
    public List<AlbumResponseDto> getAllMyAlbums(HttpServletRequest request) {
        Long userId = getUserIdFromToken(request);
        return getAlbumsForUser(request, userId);
    }

    @GetMapping("/albums/user/{id}")
    public List<AlbumResponseDto> getAlbumsForUser(HttpServletRequest request, @PathVariable("id") Long userId) {
        List<AlbumsToUser> albumsToUserList = albumsToUserService.findByUserId(userId);
        List<AlbumResponseDto> callResponse = new ArrayList<>();

        for (int i = 0; i < albumsToUserList.size(); i++) {
            Map<Long, Boolean> artistIdToPrimaryStatus = new HashMap<>();
            AlbumResponseDto responseDto = new AlbumResponseDto();
            Album currAlbum = albumService.getAlbumByAlbumId(albumsToUserList.get(i).getAlbumId());
            List<AlbumsToUser> albumsToUsers = albumsToUserService.findByAlbumId(albumsToUserList.get(i).getAlbumId());
            for (int j = 0; j < albumsToUsers.size(); j++) {
                artistIdToPrimaryStatus.put(albumsToUsers.get(j).getUserId(),
                        albumsToUsers.get(j).getIsPrimaryArtist());
            }
            responseDto.setAlbumId(albumsToUserList.get(i).getAlbumId());
            responseDto.setArtistIdToPrimaryStatus(artistIdToPrimaryStatus);
            responseDto.setName(currAlbum.getName());
            responseDto.setCreatedAt(currAlbum.getCreatedAt());
            responseDto.setTotalPlays(currAlbum.getTotalPlays());
            callResponse.add(responseDto);
        }

        return callResponse;
    }

    @GetMapping("/songs/user/me")
    public List<SongResponseDto> getAllMySongs(HttpServletRequest request) {
        Long userId = getUserIdFromToken(request);
        return getSongsForUser(request, userId);
    }

    @GetMapping("/songs/top")
    public List<SongResponseDto> getTopSongs(HttpServletRequest request) {
        List<Song> topSongs = songService.findTopSongs();
        List<SongResponseDto> callResponse = new ArrayList<>();

        for (int i = 0; i < topSongs.size(); i++) {
            Map<Long, Boolean> artistIdToPrimaryStatus = new HashMap<>();
            SongResponseDto responseDto = new SongResponseDto();
            Song currSong = songService.getSongBySongId(topSongs.get(i).getSongId());
            List<SongsToUser> songsToUsers = songsToUserService.findBySongId(topSongs.get(i).getSongId());
            for (int j = 0; j < songsToUsers.size(); j++) {
                artistIdToPrimaryStatus.put(songsToUsers.get(j).getUserId(),
                        songsToUsers.get(j).getIsPrimaryArtist());
            }
            responseDto.setAlbumId(currSong.getAlbumId());
            responseDto.setArtistIdToPrimaryStatus(artistIdToPrimaryStatus);
            responseDto.setCreatedAt(currSong.getCreatedAt());
            responseDto.setName(currSong.getName());
            responseDto.setSongId(currSong.getSongId());
            responseDto.setTotalPlays(currSong.getTotalPlays());
            callResponse.add(responseDto);
        }
        return callResponse;

    }

    @GetMapping("/songs/user/{id}")
    public List<SongResponseDto> getSongsForUser(HttpServletRequest request, @PathVariable("id") Long userId) {

        List<SongsToUser> songsToUserList = songsToUserService.findByUserId(userId);
        List<SongResponseDto> callResponse = new ArrayList<>();

        for (int i = 0; i < songsToUserList.size(); i++) {
            Map<Long, Boolean> artistIdToPrimaryStatus = new HashMap<>();
            SongResponseDto responseDto = new SongResponseDto();
            Song currSong = songService.getSongBySongId(songsToUserList.get(i).getSongId());
            List<SongsToUser> songsToUsers = songsToUserService.findBySongId(songsToUserList.get(i).getSongId());
            for (int j = 0; j < songsToUsers.size(); j++) {
                artistIdToPrimaryStatus.put(songsToUsers.get(j).getUserId(),
                        songsToUsers.get(j).getIsPrimaryArtist());
            }
            responseDto.setAlbumId(currSong.getAlbumId());
            responseDto.setArtistIdToPrimaryStatus(artistIdToPrimaryStatus);
            responseDto.setCreatedAt(currSong.getCreatedAt());
            responseDto.setName(currSong.getName());
            responseDto.setSongId(currSong.getSongId());
            responseDto.setTotalPlays(currSong.getTotalPlays());
            callResponse.add(responseDto);
        }
        return callResponse;
    }

    @GetMapping("/songs/{id}")
    public Song getSongFromId(HttpServletRequest request, @PathVariable("id") Long songId) {
        return songService.getSongBySongId(songId);
    }

    @GetMapping("/albums/{id}")
    public Album getAlbumFromId(HttpServletRequest request, @PathVariable("id") Long albumId) {
        return albumService.getAlbumByAlbumId(albumId);
    }

    @GetMapping("/albums/top")
    public List<Album> getTopAlbums(HttpServletRequest request) {
        return albumService.findTopAlbums();
    }

    @GetMapping("/albums/{id}/songs")
    public List<SongResponseDto> getSongsFromAlbum(HttpServletRequest request, @PathVariable("id") Long albumId) {
        List<Song> allSongInAlbum = songService.getSongsByAlbumId(albumId);
        List<SongResponseDto> callResponse = new ArrayList<>();

        for (int i = 0; i < allSongInAlbum.size(); i++) {
            List<SongsToUser> songsToUserList = songsToUserService.findBySongId(allSongInAlbum.get(i).getSongId());
            Song currSong = songService.getSongBySongId(allSongInAlbum.get(i).getSongId());
            SongResponseDto responseDto = new SongResponseDto();

            Map<Long, Boolean> artistIdToPrimaryStatus = new HashMap<>();
            for (int j = 0; j < songsToUserList.size(); j++) {
                artistIdToPrimaryStatus.put(songsToUserList.get(j).getUserId(),
                        songsToUserList.get(j).getIsPrimaryArtist());
            }

            responseDto.setAlbumId(albumId);
            responseDto.setCreatedAt(currSong.getCreatedAt());
            responseDto.setName(currSong.getName());
            responseDto.setTotalPlays(currSong.getTotalPlays());
            responseDto.setSongId(currSong.getSongId());
            responseDto.setArtistIdToPrimaryStatus(artistIdToPrimaryStatus);
            callResponse.add(responseDto);

        }
        return callResponse;

    }

    @PostMapping("/albums/create")
    public AlbumResponseDto createAlbum(HttpServletRequest request, @RequestBody AlbumRequestDto requestDto) {
        Album newAlbum = new Album();
        newAlbum.setName(requestDto.getName());
        newAlbum.setTotalPlays(0L);
        newAlbum.setCreatedAt(new Date());
        Album createdAlbum = albumService.saveAlbum(newAlbum);

        Map<Long, Boolean> artistIdToPrimaryStatus = requestDto.getArtistIdToPrimaryStatus();
        for (Map.Entry<Long, Boolean> entry : artistIdToPrimaryStatus.entrySet()) {
            AlbumsToUser atUser = new AlbumsToUser();
            atUser.setAlbumId(createdAlbum.getAlbumId());
            atUser.setUserId(entry.getKey());
            atUser.setIsPrimaryArtist(entry.getValue());
            albumsToUserService.saveAlbumsToUser(atUser);
        }

        AlbumResponseDto responseDto = new AlbumResponseDto();
        responseDto.setAlbumId(createdAlbum.getAlbumId());
        responseDto.setCreatedAt(createdAlbum.getCreatedAt());
        responseDto.setName(createdAlbum.getName());
        responseDto.setArtistIdToPrimaryStatus(artistIdToPrimaryStatus);
        responseDto.setTotalPlays(createdAlbum.getTotalPlays());
        return responseDto;
    }

    @PostMapping("/songs/create")
    public SongResponseDto createSong(HttpServletRequest request, @RequestBody SongRequestDto requestDto) {
        Song newSong = new Song();
        newSong.setName(requestDto.getName());
        newSong.setAlbumId(requestDto.getAlbumId());
        newSong.setCreatedAt(new Date());
        newSong.setTotalPlays(0L);
        Song createdSong = songService.saveSong(newSong);

        Map<Long, Boolean> artistIdToPrimaryStatus = requestDto.getArtistIdToPrimaryStatus();
        for (Map.Entry<Long, Boolean> entry : artistIdToPrimaryStatus.entrySet()) {
            SongsToUser stUser = new SongsToUser();
            stUser.setSongId(createdSong.getSongId());
            stUser.setUserId(entry.getKey());
            stUser.setIsPrimaryArtist(entry.getValue());
            songsToUserService.saveSongsToUser(stUser);
        }

        SongResponseDto responseDto = new SongResponseDto();
        responseDto.setSongId(createdSong.getSongId());
        responseDto.setAlbumId(createdSong.getAlbumId());
        responseDto.setName(createdSong.getName());
        responseDto.setCreatedAt(createdSong.getCreatedAt());
        responseDto.setTotalPlays(0L);
        responseDto.setArtistIdToPrimaryStatus(artistIdToPrimaryStatus);
        return responseDto;
    }

    @DeleteMapping("/songs/{songId}")
    public void deleteSong(HttpServletRequest request, @PathVariable("songId") Long songId) {
        songService.deleteSong(songId);
        List<SongsToUser> artists = songsToUserService.findBySongId(songId);
        for (SongsToUser stUser : artists) {
            songsToUserService.deleteSongsToUser(stUser.getSongsToUserId());
        }
    }

    @DeleteMapping("/albums/{albumId}")
    public void deleteAlbum(HttpServletRequest request, @PathVariable("albumId") Long albumId) {
        albumService.deleteAlbum(albumId);

        List<Song> songs = songService.getSongsByAlbumId(albumId);
        for (Song song : songs) {
            deleteSong(request, song.getSongId());
        }

        List<AlbumsToUser> artists = albumsToUserService.findByAlbumId(albumId);
        for (AlbumsToUser atUser : artists) {
            albumsToUserService.deleteAlbumsToUser(atUser.getAlbumsToUserId());
        }
    }

    @PutMapping("/songs/{songId}")
    public Song updateSong(HttpServletRequest request, @PathVariable("songId") Long songId, @RequestBody Song song) {
        Song currSong = songService.getSongBySongId(songId);
        currSong.setAlbumId(song.getAlbumId());
        currSong.setName(song.getName());
        return songService.updateSong(currSong);
    }

    @PutMapping("/albums/{albumId}")
    public Album updateAlbum(HttpServletRequest request, @PathVariable("albumId") Long albumId,
            @RequestBody Album album) {
        Album currAlbum = albumService.getAlbumByAlbumId(albumId);
        currAlbum.setName(album.getName());
        return albumService.updateAlbum(currAlbum);
    }

    private Long getUserIdFromToken(HttpServletRequest request) {
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
