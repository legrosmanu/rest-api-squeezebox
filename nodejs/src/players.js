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
                id: item.playerid,
                uuid: item.uuid,
                name: item.name,
                ip: item.ip,
                model: item.modelname,
                can_power_off: (item.canpoweroff === 1),
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
    getAllPlayers().then(function (players) {
        player = null;
        for (var i = 0 ; i < players.length && player === null ; i++) {
            if (players[i].uuid === uuid) {
                player = players[i];
            }
        }
        deferred.resolve(player);
    }, function (error) {
        deferred.reject(error);
    });
    return deferred.promise;
};

exports.getNbPlayers = getNbPlayers;
exports.getAllPlayers = getAllPlayers;
exports.getPlayers = getPlayers;
exports.getPlayer = getPlayer;