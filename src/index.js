var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var PlayerAPI = require('./api/PlayerServices');

var app = express();

app.use(bodyParser.json()); // for parsing application/json

if (process.argv.length < 4) {
    console.log("ERROR : Check the parameters. You have to use 'node {squeezebox_server_url} {port_for_your_api}'");
    return;
}

let SlimHelper = require('./slim-server-wrapper/SlimHelper');
SlimHelper.setUrl(process.argv[2]);

PlayerAPI.setEndPoints(app);

var port = process.env.PORT || process.argv[3];
http.createServer(app).listen(port);