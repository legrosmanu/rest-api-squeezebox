var request = require('request');
var Q = require("q");

var slimServerURL = null;

var setUrl = function (url) {
    slimServerURL = 'http://' + url + '/jsonrpc.js';
};

var slimRequest = function (params) {
    var deferred = Q.defer();
    var slimCommand = {
        id: 1,
        method: 'slim.request'
    }
    slimCommand.params = params;
    request({
        url: slimServerURL,
        method: "POST",
        json: true,
        body: slimCommand
    }, function (error, response, body) {
        if (error) {
            console.log("Error slimRequest : " + error);
            deferred.reject(error);
        } else {
            deferred.resolve(body.result);
        }
    });
    return deferred.promise;
};



/***************************************************************************
 * Players function
 * 
 **************************************************************************/

var getNbPlayers = function () {
    var deferred = Q.defer();
    var slimParams = ['-', ['player', 'count', '?']];
    slimRequest(slimParams).then(function (result) {
        if (result._count !== undefined) {
            deferred.resolve(result._count);
        } else {
            deferred.reject("result._count nout found");
        }
    }, function (error) {
        deferred.reject(error);
    });
    return deferred.promise;
};

var getPlayers = function (numberPlayers) {
    var deferred = Q.defer();
    var slimParams = ['-', ['players', '0', numberPlayers]];
    slimRequest(slimParams).then(function (result) {
        if (result.players_loop !== undefined) {
            deferred.resolve(result.players_loop);
        } else {
            deferred.reject("players_loop not found");
        }
    }, function (error) {
        deferred.reject(error);
    });
    return deferred.promise;
};

var getPower = function (idPlayer) {
    var deferred = Q.defer();
    var slimParams = [idPlayer, ['power', '?']];
    slimRequest(slimParams).then(function (result) {
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

var getVolume = function (idPlayer) {
    var deferred = Q.defer();
    var slimParams = [idPlayer, ['mixer', 'volume', '?']];
    slimRequest(slimParams).then(function (result) {
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

var getBass = function (idPlayer) {
    var deferred = Q.defer();
    var slimParams = [idPlayer, ['mixer', 'bass', '?']];
    slimRequest(slimParams).then(function (result) {
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

var getTreble = function (idPlayer) {
    var deferred = Q.defer();
    var slimParams = [idPlayer, ['mixer', 'treble', '?']];
    slimRequest(slimParams).then(function (result) {
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

var getSignalStrength = function (idPlayer) {
    var deferred = Q.defer();
    var slimParams = [idPlayer, ['signalstrength', '?']];
    slimRequest(slimParams).then(function (result) {
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

var getPlayMode = function (idPlayer) {
    var deferred = Q.defer();
    var slimParams = [idPlayer, ['mode', '?']];
    slimRequest(slimParams).then(function (result) {
        if (result._mode !== undefined) {
            deferred.resolve(result._mode);
        } else {
            deferred.reject("_mode not found for the player " + idPlayer);
        }
    }, function (error) {
        deferred.reject(error);
    });
    return deferred.promise;
};

// Informations about the song currently playing on the player which have idPlayer
var getInfoAboutSong = function (idPlayer) {
    var deferred = Q.defer();
    var song = {};
    var slimParams;
    Q.fcall(function () {
        slimParams = [idPlayer, ['time', '?']];
        return slimRequest(slimParams);
    }).then(function (timeResult) {
        song.secondsPlayed = timeResult._time;
        slimParams = [idPlayer, ['genre', '?']];
        return slimRequest(slimParams);
    }).then(function (genreResult) {
        song.genre = genreResult._genre;
        slimParams = [idPlayer, ['artist', '?']];
        return slimRequest(slimParams);
    }).then(function (artistResult) {
        song.artist = artistResult._artist;
        slimParams = [idPlayer, ['album', '?']];
        return slimRequest(slimParams);
    }).then(function (albumResult) {
        song.album = albumResult._album;
        slimParams = [idPlayer, ['title', '?']];
        return slimRequest(slimParams);
    }).then(function (titleResult) {
        song.title = titleResult._title;
        slimParams = [idPlayer, ['duration', '?']];
        return slimRequest(slimParams);
    }).then(function (durationResult) {
        song.duration = durationResult._duration;
        slimParams = [idPlayer, ['remote', '?']];
        return slimRequest(slimParams);
    }).then(function (remoteResult) {
        song.isRemote = (remoteResult._remote == 1);
        slimParams = [idPlayer, ['path', '?']];
        return slimRequest(slimParams);
    }).then(function (pathResult) {
        song.path = pathResult._path;
        deferred.resolve(song);
    }).catch(function (err) {
        console.log("Error catched slimserver getInfoAboutSong : " + err);
        deferred.reject(err);
    });
    return deferred.promise;
};

var setPlayState = function(idPlayer, newValue) {
    var deferred = Q.defer();
    var song = {};
    var slimParams = [idPlayer, ['mode', newValue]];
    slimRequest(slimParams).then(function(result) {
        deferred.resolve(result);
    }, function(err) {
        console.log("Error slimserver setPlayState : " + err);
        deferred.reject(err);
    });
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
exports.getSignalStrength = getSignalStrength;
exports.getPlayMode = getPlayMode;
exports.getInfoAboutSong = getInfoAboutSong;
exports.setPlayState = setPlayState;