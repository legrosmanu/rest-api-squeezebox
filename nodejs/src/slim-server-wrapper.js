var request = require('request');
var Q = require("q");

var slimServerURL = null;

var setUrl = function (url) {
    slimServerURL = 'http://' + url + '/jsonrpc.js';
};

var slimRequest = function (slimCommand) {
    var deferred = Q.defer();
    try {
        request({
            url: slimServerURL,
            method: "POST",
            json: true,
            body: slimCommand
        }, function (error, response, body) {
            if (error) {
                throw error;
            } else {
                deferred.resolve(body.result);
            }
        });
    } catch (err) {
        console.log("Error catched slimRequest : " + err);
        deferred.reject(err);
    }
    return deferred.promise;
};



/***************************************************************************
 * Players function
 * 
 **************************************************************************/

var getNbPlayers = function () {
    var deferred = Q.defer();
    try {
        var slimCommand = {
            id: 1,
            method: 'slim.request',
            params: ['-', ['player', 'count', '?']]
        };
        slimRequest(slimCommand).then(function (result) {
            if (result._count !== undefined) {
                deferred.resolve(result._count);
            } else {
                deferred.reject("result._count nout found");
            }
        }, function (error) {
            deferred.reject(error);
        });
    } catch (err) {
        console.log("Error catched slimserver getNbPlayers : " + err);
        deferred.reject(err);
    }
    return deferred.promise;
};

var getPlayers = function (numberPlayers) {
    var deferred = Q.defer();
    try {
        var slimCommand = {
            id: 1,
            method: 'slim.request',
            params: ['-', ['players', '0', numberPlayers]]
        };
        slimRequest(slimCommand).then(function (result) {
            if (result.players_loop !== undefined) {
                deferred.resolve(result.players_loop);
            } else {
                deferred.reject("players_loop not found");
            }
        }, function (error) {
            deferred.reject(error);
        });
    } catch (err) {
        console.log("Error catched slimserver getPlayers : " + err);
        deferred.reject(err);
    }

    return deferred.promise;
};

var getPower = function (idPlayer) {
    var deferred = Q.defer();
    try {
        var slimCommand = {
            id: 1,
            method: 'slim.request',
            params: [idPlayer, ['power', '?']]
        };
        slimRequest(slimCommand).then(function (result) {
            if (result._power !== undefined) {
                var power = "on";
                if (result._power == 0) power = "off";
                deferred.resolve(power);
            } else {
                deferred.reject("_power not found for the player " + idPlayer);
            }
        }, function (error) {
            deferred.reject(error);
        });
    } catch (err) {
        console.log("Error catched slimserver getPower : " + err);
        deferred.reject(err);
    }
    return deferred.promise;
};

var getVolume = function (idPlayer) {
    var deferred = Q.defer();
    try {
        var slimCommand = {
            id: 1,
            method: 'slim.request',
            params: [idPlayer, ['mixer', 'volume', '?']]
        };
        slimRequest(slimCommand).then(function (result) {
            if (result._volume !== undefined) {
                deferred.resolve(result._volume);
            } else {
                deferred.reject("_volume not found for the player " + idPlayer);
            }
        }, function (error) {
            deferred.reject(error);
        });
    } catch (err) {
        console.log("Error catched slimserver getVolume : " + err);
        deferred.reject(err);
    }
    return deferred.promise;
};

var getBass = function (idPlayer) {
    var deferred = Q.defer();
    try {
        var slimCommand = {
            id: 1,
            method: 'slim.request',
            params: [idPlayer, ['mixer', 'bass', '?']]
        };
        slimRequest(slimCommand).then(function (result) {
            if (result._bass !== undefined) {
                deferred.resolve(result._bass);
            } else {
                deferred.reject("_bass not found for the player " + idPlayer);
            }
        }, function (error) {
            deferred.reject(error);
        });
    } catch (err) {
        console.log("Error catched slimserver getBass : " + err);
        deferred.reject(err);
    }
    return deferred.promise;
};

var getTreble = function (idPlayer) {
    var deferred = Q.defer();
    try {
        var slimCommand = {
            id: 1,
            method: 'slim.request',
            params: [idPlayer, ['mixer', 'treble', '?']]
        };
        slimRequest(slimCommand).then(function (result) {
            if (result._treble !== undefined) {
                deferred.resolve(result._treble);
            } else {
                deferred.reject("_treble  not found for the player " + idPlayer);
            }
        }, function (error) {
            deferred.reject(error);
        });
    } catch (err) {
        console.log("Error catched slimserver getTreble : " + err);
        deferred.reject(err);
    }
    return deferred.promise;
};

exports.setUrl = setUrl;
exports.slimRequest = slimRequest;
exports.getNbPlayers = getNbPlayers;
exports.getPlayers = getPlayers;
exports.getVolume = getVolume;
exports.getBass = getBass;
exports.getTreble = getTreble;
exports.getPower = getPower;