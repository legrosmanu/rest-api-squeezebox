var Players = require('../business/players');
var Player = require('../business/player');
var Q = require("q");
var Security = require('./token');

exports.setEndPoints = function (app) {

    app.get('/players', requireAuthentication, function (req, res) {
        Players.getAllPlayers().then(function (players) {
            res.send(players);
        }, function (error) {
            res.status(500).send({
                'error': error,
                'message': 'Error to get players.'
            });
        });
    });

    app.get('/players/:uuid', requireAuthentication, function (req, res) {
        Player.getPlayer(req.params.uuid).then(function (player) {
            if (player === null) {
                res.sendStatus(404);
            } else {
                res.send(player);
            }
        }, function (error) {
            res.status(500).send({
                'error': error,
                'message': 'Error to get player with uuid ' + uuid
            });
        });
    });

    app.patch('/players/:uuid', requireAuthentication, function (req, res) {
        if (req.body.play_state !== undefined) {
            Q.fcall(function () {
                return Player.getPlayer(req.params.uuid);
            }).then(function (player) {
                return Player.setPlayState(player, req.body.play_state);
            }).then(function () {
                res.sendStatus(204);
            }).catch(function (err) {
                res.status(500).send({
                    'error': err,
                    'message': 'Ooopppsss. There is a problem with the patch.'
                });
            });
        } else {
            res.status(400).send({
                'error': 400,
                'message': 'Error to patch the player. Operation proposed only to patch play_state.'
            });
        }
    });

    app.patch('/players/:uuid/mixer', requireAuthentication, function (req, res) {
        Q.fcall(function () {
            return Player.getPlayer(req.params.uuid);
        }).then(function (player) {
            return Player.updateMixer(player, req.body);
        }).then(function () {
            res.sendStatus(204);
        }).catch(function (err) {
            res.status(500).send({
                'error': err,
                'message': 'Ooopppsss. There is a problem with the patch of the mixer.'
            });
        });
    });

    app.patch('/players/:uuid/playlist', requireAuthentication, function(req, res) {
        Q.fcall(function () {
            return Player.getPlayer(req.params.uuid);
        }).then(function(player) {
            // For now, just to change the track which is currently played.
            // So we wait the index_track_played attribute.
            return Player.changeTrackPlayed(player, req.body.index_track_played);
        }).then(function () {
            res.sendStatus(204);
        }).catch(function (err) {
            res.status(500).send({
                'error': err,
                'message': 'Ooopppsss. There is a problem with the patch of the playlist.'
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