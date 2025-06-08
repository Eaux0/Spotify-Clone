Tables:

1.  Users: UserId, Username, Password, Role, Name ✅
2.  Songs: SongId, TotalPlays, AlbumId(AlbumId), createdAt, Name ✅
3.  Albums: AlbumId, TotalPlays, Likes, createdAt, Name ✅
4.  Playlists: PlayListId, TotalPlays, UserId(UserId), createdAt, Name ✅
5.  SongsToPlaylist: SongsToPlaylistId, PlayListId(PlayListId), SongId(SongId) ✅
6.  AlbumsToUser: AlbumsToUserId, AlbumId(AlbumId), UserId(UserId), isPrimaryArtist ✅
7.  SongsToUser: SongsToUserId, SongId(SongId), UserId(UserId), isPrimaryArtist ✅
8.  RecentlyPlayed: RecentlyPlayedSongId, UserId(UserId), SongId(songId)

ADMIN Creds:
{
"username": "admin1",
"password": "admin123",
"role": "ROLE_USER",
"name": "Admin User"
}
