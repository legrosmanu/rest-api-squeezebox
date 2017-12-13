var express = require('express');
var http = require('http');

var slimServer = require('./slim-server-wrapper');
var api = require('./api');

var app = express();

if (process.argv.length < 4) {
    console.log("ERROR : Check the parameters. You have to use 'node {squeezebox_server_url} {port_for_your_api}'");
    return;
}

slimServer.setUrl(process.argv[2]);

api.setEndPoints(app);

var port = process.env.PORT || process.argv[3];
http.createServer(app).listen(port);