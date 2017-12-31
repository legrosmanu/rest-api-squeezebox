var Q = require("q");
var SlimServerPlayers = require('../slim-server-wrapper/players');

var getNbPlayers = function () {
    var deferred = Q.defer();
    SlimServerPlayers.getNbPlayers().then(function (nbPlayers) {
        deferred.resolve(nbPlayers);
    }, function (error) {
        deferred.reject(error);
    });
    return deferred.promise;
};

var getAllPlayers = function () {
    var deferred = Q.defer();
    Q.fcall(function () {
        return getNbPlayers();
    }).then(function (nbPlayers) {
        return getPlayers(nbPlayers);
    }).then(function (players) {
        deferred.resolve(players);
    }).catch(function (error) {
        deferred.reject(error);
    });
    return deferred.promise;
};

var getPlayers = function (numberPlayers) {
    var deferred = Q.defer();
    var players = null;
    SlimServerPlayers.getPlayers(numberPlayers).then(function (playersLoop) {
        players = [];
        playersLoop.forEach(function (item) {
            var player = {
                name: item.name,
                uuid: item.uuid,
                id: item.playerid,
                ip: item.ip,
                model: item.modelname,
                firmware_version: item.firmware
            };
            players.push(player);
        });
        deferred.resolve(players);
    }, function (error) {
        deferred.reject(error);
    });

    return deferred.promise;

};

exports.getNbPlayers = getNbPlayers;
exports.getAllPlayers = getAllPlayers;
exports.getPlayers = getPlayers;