var Q = require("q");
var SlimRequest = require('./slim-request');

var getNbPlayers = function () {
    var deferred = Q.defer();
    var slimParams = ['-', ['player', 'count', '?']];
    SlimRequest.slimRequest(slimParams).then(function (result) {
        if (result._count !== undefined) {
            deferred.resolve(result._count);
        } else {
            deferred.reject("result._count nout found");
        }
    }, function (error) {
        deferred.reject(error);
    });
    return deferred.promise;
};

var getPlayers = function (numberPlayers) {
    var deferred = Q.defer();
    var slimParams = ['-', ['players', '0', numberPlayers]];
    SlimRequest.slimRequest(slimParams).then(function (result) {
        if (result.players_loop !== undefined) {
            deferred.resolve(result.players_loop);
        } else {
            deferred.reject("players_loop not found");
        }
    }, function (error) {
        deferred.reject(error);
    });
    return deferred.promise;
};

exports.getNbPlayers = getNbPlayers;
exports.getPlayers = getPlayers;