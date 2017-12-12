var slimServer = require('./slimserver');
var Q = require("q");

exports.getNbPlayers = function () {
    var deferred = Q.defer();
    var slimCommand = {
        id: 1,
        method: 'slim.request',
        params: ['-', ['player', 'count', '?']]
    };
    slimServer.slimRequest(slimCommand).then(function (result) {
        deferred.resolve(result._count);
    }, function (error) {
        deferred.reject(error);
    });
    return deferred.promise;
}


exports.getPlayers = function (numberPlayers) {

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
