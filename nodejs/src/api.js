var playersDAO = require('./players');
var Q = require("q");

exports.setEndPoints = function (app) {

    app.get('/players', function (req, res) {
        playersDAO.getAllPlayers().then(function (players) {
            res.send(players);
        }, function (error) {
            res.status(500).send({
                'error': error,
                'message': 'Error to get players.'
            });
        });
    });

    app.get('/players/:uuid', function(req, res) {
        playersDAO.getPlayer(req.params.uuid).then(function(player) {
            if (player === null) {
                res.sendStatus(404);
            } else {
                res.send(player);
            }
        }, function(error) {
            res.status(500).send({
                'error': error,
                'message': 'Error to get player with uuid ' + uuid
            });
        });
    });

};