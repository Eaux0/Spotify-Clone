package io.music.search.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.music.search.models.User;
import io.music.search.dto.AlbumResponseDto;
import io.music.search.dto.SongResponseDto;
import io.music.search.dto.UserResponseDto;
import io.music.search.models.Album;
import io.music.search.models.AlbumsToUser;
import io.music.search.models.Song;
import io.music.search.models.SongsToUser;
import io.music.search.service.AlbumService;
import io.music.search.service.AlbumsToUserService;
import io.music.search.service.SongService;
import io.music.search.service.SongsToUserService;
import io.music.search.service.UserService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/search")
public class SearchController {
    @Autowired
    private SongService songService;

    @Autowired
    private AlbumService albumService;

    @Autowired
    private UserService userService;

    @Autowired
    SongsToUserService songsToUserService;

    @Autowired
    AlbumsToUserService albumsToUserService;

    // @Autowired
    // private JwtUtil jwtUtil;

    @GetMapping
    public Map<String, Object> searchByQuery(@RequestParam("q") String query, HttpServletRequest request) {

        Map<String, Object> result = new HashMap<>();
        result.put("users", getUserByName(query));
        result.put("albums", getAlbumByName(query));
        result.put("songs", getSongByName(query));

        return result;

    }

    public List<UserResponseDto> getUserByName(String query) {
        List<User> searchUsers = userService.getUserByString(query);
        List<UserResponseDto> searchUserResponse = new ArrayList<>();
        for (int i = 0; i < Math.min(searchUsers.size(), 5); i++) {
            searchUserResponse.add(new UserResponseDto(searchUsers.get(i).getName(), searchUsers.get(i).getRole(),
                    searchUsers.get(i).getUserId()));
        }
        return searchUserResponse;
    }

    public List<AlbumResponseDto> getAlbumByName(String query) {
        List<Album> searchAlbums = albumService.getAlbumByString(query);
        List<AlbumResponseDto> searchAlbumResponse = new ArrayList<>();
        for (int i = 0; i < Math.min(searchAlbums.size(), 5); i++) {
            AlbumsToUser albumsToUser = albumsToUserService.getArtistFromAlbum(searchAlbums.get(i).getAlbumId());
            if (albumsToUser == null)
                continue;
            String artistName = userService.getArtistName(albumsToUser.getUserId());
            searchAlbumResponse.add(
                    new AlbumResponseDto(searchAlbums.get(i).getName(), artistName,
                            searchAlbums.get(i).getTotalPlays(), searchAlbums.get(i).getAlbumId()));
        }
        return searchAlbumResponse;
    }

    public List<SongResponseDto> getSongByName(String query) {
        List<Song> searchSongs = songService.getSongByString(query);
        List<SongResponseDto> searchSongResponse = new ArrayList<>();
        for (int i = 0; i < Math.min(searchSongs.size(), 5); i++) {
            SongsToUser songsToUser = songsToUserService.getSongByPrimaryArtist(searchSongs.get(i).getSongId());
            String artistName = userService.getArtistName(songsToUser.getUserId());
            searchSongResponse.add(
                    new SongResponseDto(searchSongs.get(i).getName(), artistName, searchSongs.get(i).getTotalPlays(),
                            searchSongs.get(i).getSongId()));
        }
        return searchSongResponse;
    }

    // private Long getUserIdFromToken(HttpServletRequest request) {
    // String token = extractTokenFromRequest(request);
    // if (token == null || !jwtUtil.isTokenValid(token)) {
    // throw new RuntimeException("Invalid or missing token");
    // }
    // return jwtUtil.extractUserId(token);
    // }

    // private String extractTokenFromRequest(HttpServletRequest request) {
    // String authHeader = request.getHeader("Authorization");
    // if (authHeader != null && authHeader.startsWith("Bearer ")) {
    // return authHeader.substring(7);
    // }
    // return null;
    // }

}
