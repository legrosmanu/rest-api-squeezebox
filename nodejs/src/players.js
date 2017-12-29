var slimServer = require('./slim-server-wrapper');
var Q = require("q");
var playerStatus = require('./player-status');

var getNbPlayers = function () {
    var deferred = Q.defer();
    slimServer.getNbPlayers().then(function (nbPlayers) {
        deferred.resolve(nbPlayers);
    }, function (error) {
        console.log("Error getNbPlayers : " + error);
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
    }).catch(function (err) {
        console.log("Error getAllPlayers : " + err);
        deferred.reject(err);
    });
    return deferred.promise;
};

var getPlayers = function (numberPlayers) {

    var deferred = Q.defer();

    slimServer.getPlayers(numberPlayers).then(function (playersLoop) {
        var players = [];
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

var getPlayer = function (uuid) {
    var deferred = Q.defer();
    var player = null;
    try {
        Q.fcall(function () {
            return getAllPlayers();
        }).then(function (players) {
            for (var i = 0; i < players.length && player === null; i++) {
                if (players[i].uuid === uuid) {
                    player = players[i];
                }
            }
            if (player !== null) {
                return slimServer.getSignalStrength(player.id);
            } else {
                deferred.reject("player is null");
            }
        }).then(function (signalStrength) {
            player.signal_strength = signalStrength;
            return playerStatus.getMixer(player);
        }).then(function (mixer) {
            player.mixer = mixer;
            return playerStatus.getReadStatus(player);
        }).then(function (readStatus) {
            player.read_status = readStatus;
            deferred.resolve(player);
        }).catch(function (error) {
            console.log("Error getPlayer : " + errorerr);
            deferred.reject(error);
        });
    } catch (err) {
        console.log("Error catched getPlayer : " + err);
        deferred.reject(err);
    }
    return deferred.promise;
};

exports.getNbPlayers = getNbPlayers;
exports.getAllPlayers = getAllPlayers;
exports.getPlayers = getPlayers;
exports.getPlayer = getPlayer;