var slimServer = require('./slimserver');
var Q = require("q");

exports.getNbPlayers = function() {
    var deferred = Q.defer();
    var slimCommand = {
        id: 1,
        method: 'slim.request',
        params: ['-', ['player', 'count', '?']]
    };
    slimServer.slimRequest(slimCommand).then(function(result) {
        deferred.resolve(result._count);
    }, function(error) {
        deferred.reject(error);
    });
    return deferred.promise;
}


exports.getPlayer = function(index) {

    var deferred = Q.defer();

    var player = {
        id: '',
        uuid: -1,
        name: "",
        ip: '',
        model: "",
        canPowerOff: false
    };

    var slimCommand = {
        id: 1,
        method: 'slim.request'
    };

    Q.fcall(function() {
        slimCommand.params = [index, ['player', 'id', '?']];
        return slimServer.slimRequest(slimCommand);
    }).then(function(resultCmd) {
        player.id = resultCmd._id;
        slimCommand.params = [player.id, ['player', 'uuid', '?']];
        return slimServer.slimRequest(slimCommand);
    }).then(function(resultCmd) {
        player.uuid = resultCmd._uuid;
        slimCommand.params = [player.id, ['player', 'name', '?']];
        return slimServer.slimRequest(slimCommand);
        deferred.resolve(player);
    }).then(function(resultCmd) {
        player.name = resultCmd._name;
        slimCommand.params = [player.id, ['player', 'ip', '?']];
        return slimServer.slimRequest(slimCommand);
    }).then(function(resultCmd) {
        player.ip = resultCmd._ip;
        slimCommand.params = [player.id, ['player', 'model', '?']];
        return slimServer.slimRequest(slimCommand);
    }).then(function(resultCmd) {
        player.model = resultCmd._model;
        slimCommand.params = [player.id, ['player', 'canpoweroff', '?']];
        return slimServer.slimRequest(slimCommand);
    }).then(function(resultCmd) {
        player.canPowerOff = (resultCmd._canpoweroff === 1);
        deferred.resolve(player);
    });

    return deferred.promise;

};
