var slimServer = require('./slim-server-wrapper');
var Q = require("q");


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

var getAllPlayers = function() {
    var deferred = Q.defer();
    Q.fcall(function () {
        return getNbPlayers();
    }).then(function (nbPlayers) {
        getPlayers(nbPlayers).then(function (players) {
            deferred.resolve(players);
        }, function (error) {
            console.log("Error getAllPlayers : " + error);
            deferred.reject(error);
        });
    });
    return deferred.promise;
};

var getPlayers = function (numberPlayers) {

    var deferred = Q.defer();

    slimServer.getPlayers(numberPlayers).then(function (playersLoop) {
        var players = [];
        playersLoop.forEach(function(item) {
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

var getPlayer = function(uuid) {
    var deferred = Q.defer();
    Q.fcall(function() {
        return getAllPlayers();
    }).then(function(players) {
        var player = null;
        for (var i = 0 ; i < players.length && player === null ; i++) {
            if (players[i].uuid === uuid) {
                player = players[i];
            }
        }
        if (player !== null) {
            player.mixer = {};
            return addVolumeToPlayer(player);
        } else {
            deferred.reject("ERR getPlayer - player is null");
        }
    }).then(function(player) {
        return addBassToPlayer(player);
    }).then(function(player) {
        return addTrebleToPlayer(player);
    }).then(function(player) {
        return addPowerToPlayer(player);
    }).then(function(player) {
        deferred.resolve(player);
    });
    return deferred.promise;
};

var addVolumeToPlayer = function(player) {
    var deferred = Q.defer();
    slimServer.getVolume(player.id).then(function(volume) {
        player.mixer.volume = volume;
        deferred.resolve(player);
    });
    return deferred.promise;
};

var addBassToPlayer = function(player) {
    var deferred = Q.defer();
    slimServer.getBass(player.id).then(function(bass) {
        player.mixer.bass = bass;
        deferred.resolve(player);
    });
    return deferred.promise;
};

var addTrebleToPlayer = function(player) {
    var deferred = Q.defer();
    slimServer.getTreble(player.id).then(function(treble) {
        player.mixer.treble = treble;
        deferred.resolve(player);
    });
    return deferred.promise;
};

var addPowerToPlayer = function(player) {
    var deferred = Q.defer();
    slimServer.getPower(player.id).then(function(power) {
        player.power = power;
        deferred.resolve(player);
    });
    return deferred.promise;
};

exports.getNbPlayers = getNbPlayers;
exports.getAllPlayers = getAllPlayers;
exports.getPlayers = getPlayers;
exports.getPlayer = getPlayer;