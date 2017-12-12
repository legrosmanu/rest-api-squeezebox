var express = require('express');
var http = require('http');
var Q = require("q");

var playersAPI = require('./players');
var slimServer = require('./slimserver');

var app = express();

if (process.argv.length < 4) {
    console.log("ERROR : Check the parameters. You have to use 'node {squeezebox_server_url} {port_for_your_api}'");
    return;
}

slimServer.setUrl(process.argv[2]);

app.get('/players', function (req, res) {
    Q.fcall(function () {
        return playersAPI.getNbPlayers();
    }).then(function (nbPlayers) {
        playersAPI.getPlayers(nbPlayers).then(function (players) {
            res.send(players);
        }, function (error) {
            console.log(error);
            res.status(500).send({
                'error': error,
                'message': 'Error to get players.'
            });
        });
    });
});


var port = process.env.PORT || process.argv[3];
http.createServer(app).listen(port);