let SlimHelper = require('../slim-server-wrapper/SlimHelper');

module.exports = class SongPlayed {

    constructor(player) {
        this.player = player;
    }

    async init() {
        const data = await Promise.all([
            SlimHelper.sendRequest([this.player.id, ['playlist', 'index', '?']]),
            SlimHelper.sendRequest([this.player.id, ['time', '?']]),
            SlimHelper.sendRequest([this.player.id, ['duration', '?']]),
            SlimHelper.sendRequest([this.player.id, ['artist', '?']]),
            SlimHelper.sendRequest([this.player.id, ['album', '?']]),
            SlimHelper.sendRequest([this.player.id, ['title', '?']]),
            SlimHelper.sendRequest([this.player.id, ['remote', '?']]),
            SlimHelper.sendRequest([this.player.id, ['path', '?']])
        ]);
        this.indexInPlaylist = data[0]._index;
        this.secondsPlayed = data[1]._time;
        this.duration = data[2]._duration;
        this.artist = data[3]._artist;
        this.album = data[4]._album;
        this.title = data[5]._title;
        this.isRemote = (data[6]._remote) ? true : false;
        this.path = data[7]._path;
    }

    async setIndexSongPlayedOnPlaylist(newIndex) {
        await SlimHelper.sendRequest([this.player.id, ['playlist', 'index', newIndex]]);
    }


    async nextTrack() {
        await SlimHelper.sendRequest([this.player.id, ['playlist', 'index', '+1']]);
    }

    async previousTrack() {
        if (this.indexInPlaylist > 0) {
            await SlimHelper.sendRequest([this.player.id, ['playlist', 'index', '-1']]);
        } else {
            await this.setIndexSongPlayedOnPlaylist(0);
        }
    }

    toAPI() {
        return {
            index_in_playlist: this.indexInPlaylist,
            seconds_played: this.secondsPlayed,
            duration: this.duration,
            artist: this.artist,
            album: this.album,
            title: this.title,
            is_remote: this.isRemote,
            path: this.path
        };
    }

}