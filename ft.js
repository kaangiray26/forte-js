export { Forte }

class Forte {
    constructor(server, username, token) {
        this.username = username;
        this.token = token;
        this.server = server;

        this.online = false;
        this.session = null;

        this.login();
    }

    // Login using credentials and get session
    async login() {
        let auth = btoa(this.username + ":" + this.username);
        await fetch(this.server + '/api/session', {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + auth
            }
        })
            .then((response) => {
                this.online = true;
                return response.json();
            })
            .then((response) => {
                this.session = response.session;
            })
            .catch((error) => {
                console.log(error);
                throw new Error("Failed to login via credentials.");
            });
    }

    // Make a GET request to the API
    async API(query) {
        return await fetch(this.server + '/api' + query + `?session=${this.session}`, {
            method: "GET",
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Make a GET request to the Federated API
    async fAPI(domain, query, challenge = null) {
        return await fetch(this.server + '/f/api' + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "domain": domain,
                "query": query,
                "challenge": challenge
            }),
            credentials: "include"
        })
            .then((response) => response.json());
    }

    // Check if a server is alive
    async alive(address) {
        return await fetch(address + '/alive')
            .then(response => response.json());
    }

    // Check if the session is valid
    async test() {
        return await this.API('/test');
    }

    // Check if the session is valid
    async session_check() {
        return await this.API('/session/check');
    }

    // Upload profile cover
    async upload_profile_cover(file) {
        let formData = new FormData();
        formData.append('cover', file);

        return await fetch(this.server + '/api/cover' + `?session=${this.session}`, {
            method: "POST",
            body: formData,
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            })
    }

    // Search for a query
    async search(query) {
        return await this.API('/search/' + query);
    }

    // Search for a station
    async search_station(query) {
        return await this.API('/station/search/' + query);
    }

    // Stream a track
    async stream(track_id) {
        return await this.API('/stream/' + track_id);
    }

    // Get track stream headers
    async stream_headers(track_id) {
        return await fetch(this.server + '/api/stream' + track_id + `?session=${this.session}`, {
            method: "HEAD",
            credentials: "include"
        })
            .then((response) => {
                return response.headers;
            });
    }

    // Stream a federated track
    async federated_stream(track_id, challenge) {
        return await fetch(this.server + '/f/api/stream' + track_id + `?challenge=${challenge}`, {
            method: "GET",
            credentials: "include"
        })
            .then((response) => {
                return response.headers;
            });
    }

    // Get federated track stream headers
    async federated_stream_headers(track_id, challenge) {
        return await fetch(this.server + '/f/api/stream' + track_id + `?challenge=${challenge}`, {
            method: "HEAD",
            credentials: "include"
        })
            .then((response) => {
                return response.headers;
            });
    }

    // Get artists
    async artists(offset) {
        return await this.API('/artists/' + offset);
    }

    // Get albums
    async albums(offset) {
        return await this.API('/albums/' + offset);
    }

    // Get playlists
    async playlists(offset) {
        return await this.API('/playlists/' + offset);
    }

    // Get profile
    async profile() {
        return await this.API('/profile');
    }

    // Get profile history
    async profile_history() {
        return await this.API('/profile/history');
    }

    // Add track to profile history
    // track_id example: "12" or "12@localhost"
    async profile_history_add(track_id, challenge = null) {
        return await fetch(this.server + `/api/profile/history/add` + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "track": track_id,
                "challenge": challenge
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Get profile favorite tracks
    async profile_favorites(offset, total) {
        return await this.API('/profile/tracks/' + offset + '/' + total);
    }

    // Get profile favorite playlists
    async profile_playlists(offset, total) {
        return await this.API('/profile/playlists/' + offset + '/' + total);
    }

    // Get profile favorite albums
    async profile_albums(offset, total) {
        return await this.API('/profile/albums/' + offset + '/' + total);
    }

    // Get profile favorite artists
    async profile_artists(offset, total) {
        return await this.API('/profile/artists/' + offset + '/' + total);
    }

    // Create a playlist
    async playlist_create(title, cover) {
        let formData = new FormData();
        formData.append('title', title);
        if (cover) {
            formData.append('cover', cover);
        }

        return await fetch(this.server + '/api/profile/create_playlist' + `?session=${this.session}`, {
            method: "POST",
            body: formData,
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Get user
    async user(username) {
        return await this.API('/user/' + username);
    }

    // Get basic user info
    async user_basic(username) {
        return await this.API('/user/' + username + '/basic/');
    }

    // Get user history
    async user_history(username) {
        return await this.API('/user/' + username + '/history/');
    }

    // Get user favorite tracks
    async user_favorites(username, offset, total) {
        return await this.API('/user/' + username + '/tracks/' + offset + '/' + total);
    }

    // Get user favorite playlists
    async user_playlists(username, offset, total) {
        return await this.API('/user/' + username + '/playlists/' + offset + '/' + total);
    }

    // Get user favorite albums
    async user_albums(username, offset, total) {
        return await this.API('/user/' + username + '/albums/' + offset + '/' + total);
    }

    // Get user favorite artists
    async user_artists(username, offset, total) {
        return await this.API('/user/' + username + '/artists/' + offset + '/' + total);
    }

    // Get user friends
    async user_friends(username) {
        return await this.API('/user/' + username + '/friends');
    }

    // Get track
    async track(id) {
        return await this.API('/track/' + id)
    }

    // Get track basic information
    async track_basic(id) {
        return await this.API('/track/' + id + '/basic')
    }

    // Check if track is loved
    async is_track_loved(id) {
        return await this.API('/track/' + id + '/loved')
    }

    // Get artist
    async artist(id) {
        return await this.API('/artist/' + id)
    }

    // Get artist basic information
    async artist_basic(id) {
        return await this.API('/artist/' + id + '/basic')
    }

    // Check if artist is loved
    async is_artist_loved(id) {
        return await this.API('/artist/' + id + '/loved')
    }

    // Get album
    async album(id) {
        return await this.API('/album/' + id)
    }

    // Get album basic information
    async album_basic(id) {
        return await this.API('/album/' + id + '/basic')
    }

    // Check if album is loved
    async is_album_loved(id) {
        return await this.API('/album/' + id + '/loved')
    }

    // Get multiple tracks
    async multiple_tracks(ids) {
        return await fetch(this.server + `/api/tracks/basic` + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "ids": ids,
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Get multiple albums
    async multiple_albums(ids) {
        return await fetch(this.server + `/api/albums/basic` + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "ids": ids,
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Get multiple artists
    async multiple_artists(ids) {
        return await fetch(this.server + `/api/artists/basic` + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "ids": ids,
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Get multiple playlists
    async multiple_playlists(ids) {
        return await fetch(this.server + `/api/playlists/basic` + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "ids": ids,
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Get a random track
    async random_track() {
        return await this.API('/random/track')
    }

    // Get random tracks
    async random_tracks() {
        return await this.API('/random/tracks')
    }

    // Get profile friends
    async friends() {
        return await this.API('/friends')
    }

    // Check if profile is friend with user
    async is_friend(username) {
        return await this.API('/friends/' + username)
    }

    // Add friend
    async add_friend(username, challenge = null) {
        return await fetch(this.server + `/api/friends/add` + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": username,
                "challenge": challenge
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Remove friend
    async remove_friend(username, challenge = null) {
        return await fetch(this.server + `/api/friends/remove` + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": username,
                "challenge": challenge
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Get playlist
    async playlist(id) {
        return await this.API('/playlist/' + id)
    }

    // Get playlist basic
    async playlist_basic(id) {
        return await this.API('/playlist/' + id + '/basic')
    }

    // Delete playlist
    async delete_playlist(id) {
        return await this.API('/playlist/' + id + '/delete')
    }

    // Get playlist tracks
    async playlist_tracks(id) {
        return await this.API('/playlist/' + id + '/tracks')
    }

    // Add track to playlist
    async playlist_add(id, track, challenge = null) {
        return await fetch(this.server + `/api/playlist/` + id + '/add_track' + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "track": track,
                "challenge": challenge
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Remove track from playlist by index
    async playlist_add(id, index) {
        return await fetch(this.server + `/api/playlist/` + id + '/delete_track' + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "index": index
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Check if playlist is loved
    async is_playlist_loved(id) {
        return await this.API('/playlist/' + id + '/loved')
    }

    // Get station
    async station(id) {
        return await this.API('/station/' + id)
    }

    // Get station url
    async station_url(id) {
        return await this.API('/station/' + id + '/url')
    }

    // Get playlists of an author
    async author_playlists(username) {
        return await this.API('/author/' + username + '/playlists')
    }

    // Love track
    async love_track(id, challenge = null) {
        return await fetch(this.server + '/api/track/love' + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": id,
                "challenge": challenge
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Unlove track
    async unlove_track(id, challenge = null) {
        return await fetch(this.server + '/api/track/unlove' + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": id,
                "challenge": challenge
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Love album
    async love_album(id, challenge = null) {
        return await fetch(this.server + '/api/album/love' + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": id,
                "challenge": challenge
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Unlove album
    async unlove_album(id, challenge = null) {
        return await fetch(this.server + '/api/album/unlove' + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": id,
                "challenge": challenge
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Love artist
    async love_artist(id, challenge = null) {
        return await fetch(this.server + '/api/artist/love' + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": id,
                "challenge": challenge
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Unlove artist
    async unlove_artist(id, challenge = null) {
        return await fetch(this.server + '/api/artist/unlove' + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": id,
                "challenge": challenge
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Love playlist
    async love_playlist(id, challenge = null) {
        return await fetch(this.server + '/api/playlist/love' + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": id,
                "challenge": challenge
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Unlove playlist
    async unlove_playlist(id, challenge = null) {
        return await fetch(this.server + '/api/playlist/unlove' + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": id,
                "challenge": challenge
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Check if track exists
    async track_exists(id) {
        return await this.API('/track/' + id + '/exists')
    }

    // Check if album exists
    async album_exists(id) {
        return await this.API('/album/' + id + '/exists')
    }

    // Check if artist exists
    async artist_exists(id) {
        return await this.API('/artist/' + id + '/exists')
    }

    // Check if playlist exists
    async playlist_exists(id) {
        return await this.API('/playlist/' + id + '/exists')
    }

    // Check if user exists
    async user_exists(username) {
        return await this.API('/user/' + username + '/exists')
    }

    // Get lyrics of a track
    async lyrics(artist, track_title, challenge = null) {
        return await fetch(this.server + '/api/lyrics' + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "artist": artist,
                "title": track_title,
                "challenge": challenge
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Get Last.fm API key for authentication
    async lastfm_api_key() {
        return await this.API('/lastfm/auth')
    }

    // Get Last.fm Session key with token
    async lastfm_session_key(token) {
        return await fetch(this.server + '/api/lastfm/auth' + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "token": token,
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Get Last.fm artist correction
    async lastfm_artist(artist_title) {
        return await fetch(this.server + '/api/lastfm/artist' + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "artist": artist_title,
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Scrobble track in Last.fm
    async scrobble(track, session_key, challenge = null) {
        return await fetch(this.server + '/api/lastfm/scrobble' + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "track": track,
                "sk": session_key,
                "challenge": challenge
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Get Last.fm username
    async lastfm_username(username) {
        return await this.API('/lastfm/profile/' + username)
    }

    // Add comment
    async add_comment(username, type, id = null, uuid = null, comment) {
        return await fetch(this.server + '/api/lastfm/scrobble' + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "type": type,
                "id": id,
                "uuid": uuid,
                "comment": comment
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Get artist comments
    async artist_comments(id, offset) {
        return await this.API('/comments/artist/' + id + '/' + offset)
    }

    // Get album comments
    async album_comments(id, offset) {
        return await this.API('/comments/album/' + id + '/' + offset)
    }

    // Get playlist comments
    async playlist_comments(id, offset) {
        return await this.API('/comments/playlist/' + id + '/' + offset)
    }

    // Get encrypted federation challenge for domain
    async federation_challenge(domain) {
        return await this.API('/f/challenge/' + domain)
    }

    // Add federated comment
    async add_federated_comment(username, type, id = null, uuid = null, comment, domain, challenge) {
        return await fetch(this.server + '/f/api/comments' + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "type": type,
                "id": id,
                "uuid": uuid,
                "comment": comment,
                "domain": domain,
                "challenge": challenge
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Get federated tracks basic information
    async federated_tracks_basic(ids, domain, challenge) {
        return await fetch(this.server + '/f/api/tracks/basic' + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "ids": ids,
                "domain": domain,
                "challenge": challenge
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Get federated albums basic information
    async federated_albums_basic(ids, domain, challenge) {
        return await fetch(this.server + '/f/api/albums/basic' + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "ids": ids,
                "domain": domain,
                "challenge": challenge
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Get federated artists basic information
    async federated_artists_basic(ids, domain, challenge) {
        return await fetch(this.server + '/f/api/artists/basic' + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "ids": ids,
                "domain": domain,
                "challenge": challenge
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

    // Get federated playlists basic information
    async federated_playlists_basic(ids, domain, challenge) {
        return await fetch(this.server + '/f/api/playlists/basic' + `?session=${this.session}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "ids": ids,
                "domain": domain,
                "challenge": challenge
            }),
            credentials: "include"
        })
            .then((response) => {
                return response.json();
            });
    }

}
