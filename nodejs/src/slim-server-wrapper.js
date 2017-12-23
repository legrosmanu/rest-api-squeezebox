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
                deferred.reject(error);
            } else {
                deferred.resolve(body.result);
            }
        });
    } catch (err) {
        console.log("Error catched slimRequest : " + err);
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
            if (result._count) {
                deferred.resolve(result._count);
            } else {
                console.log("Error getNbPlayers. result._count nout found");
            }
        }, function (error) {
            console.log("Error getNbPlayers : " + error);
            deferred.reject(error);
        });
    } catch (err) {
        console.log("Error catched getNbPlayers : " + err);
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
            if (result.players_loop) {
                deferred.resolve(result.players_loop);
            } else {
                deferred.reject("ERR getPlayer. players_loop not found");
            }
        }, function (error) {
            deferred.reject(error);
        });
    } catch (err) {
        console.log("Error catched getPlayers : " + err);
    }

    return deferred.promise;
};

var getPower = function(idPlayer) {
    var deferred = Q.defer();
    try {
        var slimCommand = {
            id: 1,
            method: 'slim.request',
            params: [idPlayer, ['power', '?']]
        };
        slimRequest(slimCommand).then(function (result) {
            if (result._power) {
                var power = (result._power == 1) ? "on" : "off";
                deferred.resolve(power);
            } else {
                deferred.reject("ERR getPower for the player " + idPlayer);
            }
        }, function (error) {
            console.log("Error getPower : " + error);
            deferred.reject(error);
        });
    } catch (err) {
        console.log("Error catched getPower : " + err);
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
            if (result._volume) {
                deferred.resolve(result._volume);
            } else {
                deferred.reject("ERR getVolume for the player " + idPlayer);
            }
        }, function (error) {
            console.log("Error getNbPlayers : " + error);
            deferred.reject(error);
        });
    } catch (err) {
        console.log("Error catched getVolume : " + err);
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
            if (result._bass) {
                deferred.resolve(result._bass);
            } else {
                deferred.reject("ERR getBass for the player " + idPlayer);
            }
        }, function (error) {
            console.log("Error getBass : " + error);
            deferred.reject(error);
        });
    } catch (err) {
        console.log("Error catched getBass : " + err);
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
            if (result._treble) {
                deferred.resolve(result._treble);
            } else {
                deferred.reject("ERR getTreble for the player " + idPlayer);
            }
        }, function (error) {
            console.log("Error getTreble : " + error);
            deferred.reject(error);
        });
    } catch (err) {
        console.log("Error catched getTreble : " + err);
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