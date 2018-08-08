var Security = require('./token');
let SlimHelper = require('../slim-server-wrapper/SlimHelper');
var Player = require('../integration/player/Player');

exports.setEndPoints = function (app) {

    // We have to check how much we have players to get all the players, 
    // then get the players.
    app.get('/players', requireAuthentication, async (req, res) => {
        try {
            const resultNbPlayers = await SlimHelper.sendRequest(['-', ['player', 'count', '?']]);
            const resultPlayers = await SlimHelper.sendRequest(['-', ['players', '0', resultNbPlayers._count]]);
            let players = resultPlayers.players_loop.map(playerFromSlim => new Player(playerFromSlim.uuid));
            const initPlayerPromises = players.map(player => player.init());
            await Promise.all(initPlayerPromises);
            let playersToSend = [];
            for (let player of players) {
                playersToSend.push(player.toAPI());
            }
            res.send(playersToSend);
        } catch (error) {
            let errorToSend = errorManager(error, 'GET', '/players');
            res.status(errorToSend.codeHTTP).send(errorToSend);
        }
    });

    app.get('/players/:uuid', requireAuthentication, async (req, res) => {
        try {
            let player = new Player(req.params.uuid);
            await player.init();
            res.send(player.toAPI());
        } catch (error) {
            let errorToSend = errorManager(error, 'GET', '/players/:uuid');
            res.status(errorToSend.codeHTTP).send(errorToSend);
        }
    });

    // According to the body, we had on an array the promises to execute, and then execute them.
    app.patch('/players/:uuid', requireAuthentication, async (req, res) => {
        try {
            let player = new Player(req.params.uuid);
            await player.init();
            let changesToDo = [];
            if (req.body.play_state !== undefined) changesToDo.push(player.setPlayState(req.body.play_state));
            if (req.body.song_currently_played !== undefined) {
                var songPlayed = player.getSongPlayed();
                if (req.body.song_currently_played.index_in_playlist == '+1') {
                    changesToDo.push(songPlayed.nextTrack());
                } else if (req.body.song_currently_played.index_in_playlist == '-1') {
                    changesToDo.push(songPlayed.previousTrack());
                } else {
                    changesToDo.push(player.songPlayed.setIndexSongPlayedOnPlaylist(req.body.song_currently_played.index_in_playlist));
                }
            }
            await Promise.all(changesToDo);
            res.sendStatus(204);
        } catch (error) {
            let errorToSend = errorManager(error, 'PATCH', '/players/:uuid');
            res.status(errorToSend.codeHTTP).send(errorToSend);
        }
    });

    // To change the playlist to play on the player, this endpoint wait the path of the new playlist
    app.patch('/players/:uuid/playlist', requireAuthentication, async (req, res) => {
        try {
            let player = new Player(req.params.uuid);
            await player.init();
            if (req.body.path !== undefined) {
                await player.getPlaylist().changePath(req.body.path);
            } else if (req.body.album_title !== undefined) {
                await player.getPlaylist().searchAlbum(req.body.album_title);
            } else if (req.body.artist_name !== undefined) {
                await player.getPlaylist().searchArtist(req.body.artist_name);
            } else {
                let error = {
                    codeHTTP: 400,
                    message: "The object is not well formed."
                };
                throw error;
            }
            res.sendStatus(204);
        } catch (error) {
            let errorToSend = errorManager(error, 'PATCH', '/players/:uuid/playlist');
            res.status(errorToSend.codeHTTP).send(errorToSend);
        }
    });

    app.delete('/players/:uuid/playlist', requireAuthentication, async (req, res) => {
        try {
            let player = new Player(req.params.uuid);
            await player.init();
            await player.getPlaylist().clear();
            res.sendStatus(204);
        } catch (error) {
            let errorToSend = errorManager(error, 'DELETE', '/players/:uuid/playlist');
            res.status(errorToSend.codeHTTP).send(errorToSend);
        }
    });

    // According to the body, we had on an array the promises to execute, and then execute them.
    app.patch('/players/:uuid/mixer', requireAuthentication, async (req, res) => {
        try {
            let player = new Player(req.params.uuid);
            await player.init();
            let mixer = await player.getMixer();
            let changesToDo = [];
            if (req.body.power !== undefined) changesToDo.push(mixer.setPower(req.body.power));
            if (req.body.volume !== undefined) changesToDo.push(mixer.setVolume(req.body.volume));
            if (req.body.bass !== undefined) changesToDo.push(mixer.setBass(req.body.bass));
            if (req.body.treble !== undefined) changesToDo.push(mixer.setTreble(req.body.treble));
            await Promise.all(changesToDo);
            res.sendStatus(204);
        } catch (error) {
            let errorToSend = errorManager(error, 'PATCH', '/players/:uuid/mixer');
            res.status(errorToSend.codeHTTP).send(errorToSend);
        }
    });

};

var errorManager = (error, HTTPMethod, URI) => {
    let errorToSend;
    if (error && error.codeHTTP !== undefined) {
        errorToSend = error;
    } else {
        errorToSend = {
            codeHTTP: 500,
            message: 'Ooooppppssss. There is a problem with the ' + HTTPMethod + ' on ' + URI
        };
    }
    console.log(errorToSend.message);
    console.log(error);
    return errorToSend;
};

// Simple security - just check a token.
var requireAuthentication = (req, res, next) => {
    if (req.query.token == Security.token) {
        next();
    } else {
        res.sendStatus(403);
    }
};