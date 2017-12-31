var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var SlimServer = require('./slim-server-wrapper/slim-request');
var PlayersAPI = require('./api/players');

var app = express();

app.use(bodyParser.json()); // for parsing application/json

if (process.argv.length < 4) {
    console.log("ERROR : Check the parameters. You have to use 'node {squeezebox_server_url} {port_for_your_api}'");
    return;
}

SlimServer.setUrl(process.argv[2]);

PlayersAPI.setEndPoints(app);

var port = process.env.PORT || process.argv[3];
http.createServer(app).listen(port);