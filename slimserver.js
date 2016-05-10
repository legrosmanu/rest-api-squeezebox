var request = require('request');
var Q = require("q");

exports.slimRequest = function(slimCommand) {
    var deferred = Q.defer();
    request({
        url: 'http://192.168.1.1:9000/jsonrpc.js',
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
