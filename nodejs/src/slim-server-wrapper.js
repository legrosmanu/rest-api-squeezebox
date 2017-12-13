var request = require('request');
var Q = require("q");

var slimServerURL = null;

var setUrl = function(url) {
    slimServerURL = 'http://' + url + '/jsonrpc.js';
};

var slimRequest = function(slimCommand) {
    var deferred = Q.defer();
    request({
        url: slimServerURL,
        method: "POST",
        json: true,
        body: slimCommand
    }, function(error, response, body) {
        if (error) {
            deferred.reject(error);
        } else {
            deferred.resolve(body.result);
        }
    });
    return deferred.promise;
};

exports.setUrl = setUrl;
exports.slimRequest = slimRequest;