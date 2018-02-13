var Players = require('../business/players');
var PlayerOld = require('../business/player');
var Q = require("q");
var Security = require('./token');
let SlimHelper = require('../slim-server-wrapper/SlimHelper');
var Player = require('../integration/Player');

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
            res.send(players);
        } catch (error) {
            console.log("Error /players : " + error);
            if (error.codeHttp) {
                res.status(error.codeHttp).send(error.message);
            } else {
                res.status(500).send({
                    'error': error,
                    'message': 'Error to get players.'
                });
            }
        }
    });

    app.get('/players/:uuid', requireAuthentication, async (req, res) => {
        try {
            let player = new Player(req.params.uuid);
            await player.init();
            res.send(player);
        } catch (error) {
            console.log("Error /players/:uuid : " + error);
            if (error.codeHttp) {
                res.status(error.codeHttp).send(error.message);
            } else {
                res.status(500).send({
                    'error': error,
                    'message': 'Error to get player with uuid ' + req.params.uuid
                });
            }
        }
    });

    app.patch('/players/:uuid', requireAuthentication, function (req, res) {
        var player = null;
        Q.fcall(function () {
            return PlayerOld.getPlayer(req.params.uuid);
        }).then(function (playerFound) {
            player = playerFound;
            return PlayerOld.setPlayState(player, req.body.play_state);
        }).then(function () {
            return PlayerOld.changeTrackPlayed(player, req.body.song_currently_played);
        }).then(function () {
            res.sendStatus(204);
        }).catch(function (err) {
            res.status(500).send({
                'error': err,
                'message': 'Ooopppsss. There is a problem with the patch for your player.'
            });
        });
    });

    app.patch('/players/:uuid/mixer', requireAuthentication, function (req, res) {
        Q.fcall(function () {
            return PlayerOld.getPlayer(req.params.uuid);
        }).then(function (player) {
            return PlayerOld.updateMixer(player, req.body);
        }).then(function () {
            res.sendStatus(204);
        }).catch(function (err) {
            res.status(500).send({
                'error': err,
                'message': 'Ooopppsss. There is a problem with the patch of the mixer.'
            });
        });
    });

};

// Simple security - just check a token.
var requireAuthentication = function (req, res, next) {
    if (req.query.token == Security.token) {
        next();
    } else {
        res.sendStatus(403);
    }
};