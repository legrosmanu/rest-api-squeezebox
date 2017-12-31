var Q = require("q");
var SlimRequest = require('../slim-request');

var getPlayState = function (idPlayer) {
    var deferred = Q.defer();
    var slimParams = [idPlayer, ['mode', '?']];
    SlimRequest.slimRequest(slimParams).then(function (result) {
        if (result._mode !== undefined) {
            deferred.resolve(result._mode);
        } else {
            deferred.reject("_mode not found for the player " + idPlayer);
        }
    }, function (error) {
        deferred.reject(error);
    });
    return deferred.promise;
};


var setPlayState = function(idPlayer, newValue) {
    var deferred = Q.defer();
    var song = {};
    var slimParams = [idPlayer, ['mode', newValue]];
    SlimRequest.slimRequest(slimParams).then(function(result) {
        deferred.resolve(result);
    }, function(err) {
        console.log("Error slimserver setPlayState : " + err);
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.getPlayState = getPlayState;
exports.setPlayState = setPlayState;