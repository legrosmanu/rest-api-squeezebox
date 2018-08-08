let SlimHelper = require('../../slim-server-wrapper/SlimHelper');

module.exports = class Playlist {

    constructor(player) {
        this.player = player;
    }

    async changePath(newPath) {
        if (newPath !== undefined) {
            await SlimHelper.sendRequest([this.player.id, ['playlist', 'play', newPath]]);
        } else {
            let error = {
                codeHTTP: 400,
                message: "To change the playlist, the object on the request must to have a path attribute."
            };
            throw error;
        }
    }

    async searchAlbum(albumTitle) {
        if (albumTitle !== undefined) {
            await SlimHelper.sendRequest([this.player.id, ['playlist', 'loadtracks', "album.titlesearch=" + albumTitle]]);
        } else {
            let error = {
                codeHTTP: 400,
                message: "To load an album, the object on the request must to have a album_title attribute."
            };
            throw error;
        }
    }

    async searchArtist(artistName) {
        if (artistName !== undefined) {
            await SlimHelper.sendRequest([this.player.id, ['playlist', 'loadtracks', "contributor.namesearch=" + artistName]]);
        } else {
            let error = {
                codeHTTP: 400,
                message: "To load the tracks of an artist, the object on the request must to have a artist_name attribute."
            };
            throw error;
        }
    }

    async clear() {
        await SlimHelper.sendRequest([this.player.id, ['playlist', 'clear']]);
    }

}