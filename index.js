var express = require('express');
var http = require('http');

var app = express();

http.createServer(app).listen(9001); // near the port 9000 used by the slimserver
