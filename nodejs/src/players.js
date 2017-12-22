var slimServer = require('./slim-server-wrapper');
var Q = require("q");


var getNbPlayers = function () {
    var deferred = Q.defer();
    var slimCommand = {
        id: 1,
        method: 'slim.request',
        params: ['-', ['player', 'count', '?']]
    };
    slimServer.slimRequest(slimCommand).then(function (result) {
        deferred.resolve(result._count);
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

    var slimCommand = {
        id: 1,
        method: 'slim.request',
        params: ['-', ['players', '0', numberPlayers]]
    };

    slimServer.slimRequest(slimCommand).then(function (result) {
        var players = [];
        result.players_loop.forEach(function(item) {
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
        deferred.resolve(player);
    });
    return deferred.promise;
};

var addVolumeToPlayer = function(player) {
    var deferred = Q.defer();
    getVolume(player).then(function(volume) {
        player.mixer.volume = volume;
        deferred.resolve(player);
    });
    return deferred.promise;
};

var addBassToPlayer = function(player) {
    var deferred = Q.defer();
    getBass(player).then(function(bass) {
        player.mixer.bass = bass;
        deferred.resolve(player);
    });
    return deferred.promise;
};

var addTrebleToPlayer = function(player) {
    var deferred = Q.defer();
    getTreble(player).then(function(treble) {
        player.mixer.treble = treble;
        deferred.resolve(player);
    });
    return deferred.promise;
};

var getVolume = function(player) {
    var deferred = Q.defer();
    var slimCommand = {
        id: 1,
        method: 'slim.request',
        params: [player.id, ['mixer', 'volume', '?']]
    };
    slimServer.slimRequest(slimCommand).then(function (result) {
        if (result._volume) {
            deferred.resolve(result._volume);
        } else {
            deferred.reject("ERR getVolume for the player " + player.id);    
        }
    }, function (error) {
        console.log("Error getNbPlayers : " + error);
        deferred.reject(error);
    });
    return deferred.promise;
};

var getBass = function(player) {
    var deferred = Q.defer();
    var slimCommand = {
        id: 1,
        method: 'slim.request',
        params: [player.id, ['mixer', 'bass', '?']]
    };
    slimServer.slimRequest(slimCommand).then(function (result) {
        if (result._bass) {
            deferred.resolve(result._bass);
        } else {
            deferred.reject("ERR getBass for the player " + player.id);    
        }
    }, function (error) {
        console.log("Error getBass : " + error);
        deferred.reject(error);
    });
    return deferred.promise;
};

var getTreble = function(player) {
    var deferred = Q.defer();
    var slimCommand = {
        id: 1,
        method: 'slim.request',
        params: [player.id, ['mixer', 'treble', '?']]
    };
    slimServer.slimRequest(slimCommand).then(function (result) {
        if (result._treble) {
            deferred.resolve(result._treble);
        } else {
            deferred.reject("ERR getTreble for the player " + player.id);    
        }
    }, function (error) {
        console.log("Error getTreble : " + error);
        deferred.reject(error);
    });
    return deferred.promise;
};

exports.getNbPlayers = getNbPlayers;
exports.getAllPlayers = getAllPlayers;
exports.getPlayers = getPlayers;
exports.getPlayer = getPlayer;