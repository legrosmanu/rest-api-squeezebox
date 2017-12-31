var Q = require("q");
var SlimRequest = require('../slim-request');

// Is the player is on or off ?
var getPower = function (idPlayer) {
    var deferred = Q.defer();
    var slimParams = [idPlayer, ['power', '?']];
    SlimRequest.slimRequest(slimParams).then(function (result) {
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
    return deferred.promise;
};

// Which is the volume of the payer ?
var getVolume = function (idPlayer) {
    var deferred = Q.defer();
    var slimParams = [idPlayer, ['mixer', 'volume', '?']];
    SlimRequest.slimRequest(slimParams).then(function (result) {
        if (result._volume !== undefined) {
            deferred.resolve(result._volume);
        } else {
            deferred.reject("_volume not found for the player " + idPlayer);
        }
    }, function (error) {
        deferred.reject(error);
    });
    return deferred.promise;
};

// How many bass is set on the player ?
var getBass = function (idPlayer) {
    var deferred = Q.defer();
    var slimParams = [idPlayer, ['mixer', 'bass', '?']];
    SlimRequest.slimRequest(slimParams).then(function (result) {
        if (result._bass !== undefined) {
            deferred.resolve(result._bass);
        } else {
            deferred.reject("_bass not found for the player " + idPlayer);
        }
    }, function (error) {
        deferred.reject(error);
    });
    return deferred.promise;
};

// How many treble is set on the player ?
var getTreble = function (idPlayer) {
    var deferred = Q.defer();
    var slimParams = [idPlayer, ['mixer', 'treble', '?']];
    SlimRequest.slimRequest(slimParams).then(function (result) {
        if (result._treble !== undefined) {
            deferred.resolve(result._treble);
        } else {
            deferred.reject("_treble  not found for the player " + idPlayer);
        }
    }, function (error) {
        deferred.reject(error);
    });
    return deferred.promise;
};

// The wifi of the player is ok ?
// Not reely on the mixer, but is on mixer.js for now.
var getSignalStrength = function (idPlayer) {
    var deferred = Q.defer();
    var slimParams = [idPlayer, ['signalstrength', '?']];
    SlimRequest.slimRequest(slimParams).then(function (result) {
        if (result._signalstrength !== undefined) {
            deferred.resolve(result._signalstrength);
        } else {
            deferred.reject("_signalstrength not found for the player " + idPlayer);
        }
    }, function (error) {
        deferred.reject(error);
    });
    return deferred.promise;
};

exports.getPower = getPower;
exports.getVolume = getVolume;
exports.getBass = getBass;
exports.getTreble = getTreble;
exports.getSignalStrength = getSignalStrength;