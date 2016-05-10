var express = require('express');
var http = require('http');
var Q = require("q");

var playersAPI = require('./players');

var app = express();

app.get('/players', function(req, res) {
    Q.fcall(function() {
        return playersAPI.getNbPlayers();
    }).then(function(nbPlayers) {
        var promisesToGetPlayers = [];
        var i = 0;
        while (i < nbPlayers) {
            promisesToGetPlayers.push(playersAPI.getPlayer(i));
            i++;
        }
        return Q.all(promisesToGetPlayers);
    }, function(error) {
        res.status(500).send({
            'error': error,
            'message': 'Error on nbPlayers check for get /players.'
        });
    }).then(function(players) {
        res.send(players);
    }, function(error) {
        res.status(500).send({
            'error': error,
            'message': 'Error on q.all to get player for get /players.'
        });
    });
});

http.createServer(app).listen(9001); // near the port 9000 used by the slimserver
