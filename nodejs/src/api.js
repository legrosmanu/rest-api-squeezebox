var PlayersDAO = require('./players');
var PlayerDAO = require('./player');
var Q = require("q");

exports.setEndPoints = function (app) {

    app.get('/players', function (req, res) {
        PlayersDAO.getAllPlayers().then(function (players) {
            res.send(players);
        }, function (error) {
            res.status(500).send({
                'error': error,
                'message': 'Error to get players.'
            });
        });
    });

    app.get('/players/:uuid', function (req, res) {
        PlayerDAO.getPlayer(req.params.uuid).then(function (player) {
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

    app.patch('/players/:uuid', function (req, res) {
        if (req.body.play_state !== undefined) {
            Q.fcall(function() {
                return PlayerDAO.getPlayer(req.params.uuid);
            }).then(function(player) {
                return PlayerDAO.setPlayState(player, req.body.play_state);
            }).then(function() {
                res.sendStatus(204);
            }).catch(function(err) {
                res.status(500).send({
                    'error': err,
                    'message': 'Ooopppsss. There is a problem with the patch.'
                });
            });
        } else {
            res.status(400).send({
                'error' : 400,
                'message' : 'Error to patch the player. Operation proposed only to patch play_state.'
            });
        }
    });

};