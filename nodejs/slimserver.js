var request = require('request');
var Q = require("q");

var slimServerURL = null;

exports.setUrl = function(url) {
    slimServerURL = 'http://' + url + '/jsonrpc.js';
};

exports.slimRequest = function(slimCommand) {
    var deferred = Q.defer();
    request({
        url: slimServerURL,
        method: "POST",
        json: true,
        body: slimCommand
    }, function(error, response, body) {
        if (error) {
            console.log(error);
            deferred.reject(error);
        } else {
            deferred.resolve(body.result);
        }
    });
    return deferred.promise;
};
