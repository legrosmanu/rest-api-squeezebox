var request = require('request');
var Q = require("q");

var slimServerURL = null;

var setUrl = function (url) {
    slimServerURL = 'http://' + url + '/jsonrpc.js';
};

var slimRequest = function (params) {
    var deferred = Q.defer();
    var slimCommand = {
        id: 1,
        method: 'slim.request'
    }
    slimCommand.params = params;
    request({
        url: slimServerURL,
        method: "POST",
        json: true,
        body: slimCommand
    }, function (error, response, body) {
        if (error) {
            console.log("Error slimRequest : " + error);
            deferred.reject(error);
        } else {
            deferred.resolve(body.result);
        }
    });
    return deferred.promise;
};

exports.setUrl = setUrl;
exports.slimRequest = slimRequest;