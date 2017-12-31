var Q = require("q");
var SlimRequest = require('../slim-request');

// Informations about the song currently playing on the player
var getInfoAboutSong = function (idPlayer) {
    var deferred = Q.defer();
    var song = {};
    var slimParams;
    Q.fcall(function () {
        slimParams = [idPlayer, ['time', '?']];
        return SlimRequest.slimRequest(slimParams);
    }).then(function (timeResult) {
        song.secondsPlayed = timeResult._time;
        slimParams = [idPlayer, ['genre', '?']];
        return SlimRequest.slimRequest(slimParams);
    }).then(function (genreResult) {
        song.genre = genreResult._genre;
        slimParams = [idPlayer, ['artist', '?']];
        return SlimRequest.slimRequest(slimParams);
    }).then(function (artistResult) {
        song.artist = artistResult._artist;
        slimParams = [idPlayer, ['album', '?']];
        return SlimRequest.slimRequest(slimParams);
    }).then(function (albumResult) {
        song.album = albumResult._album;
        slimParams = [idPlayer, ['title', '?']];
        return SlimRequest.slimRequest(slimParams);
    }).then(function (titleResult) {
        song.title = titleResult._title;
        slimParams = [idPlayer, ['duration', '?']];
        return SlimRequest.slimRequest(slimParams);
    }).then(function (durationResult) {
        song.duration = durationResult._duration;
        slimParams = [idPlayer, ['remote', '?']];
        return SlimRequest.slimRequest(slimParams);
    }).then(function (remoteResult) {
        song.isRemote = (remoteResult._remote == 1);
        slimParams = [idPlayer, ['path', '?']];
        return SlimRequest.slimRequest(slimParams);
    }).then(function (pathResult) {
        song.path = pathResult._path;
        deferred.resolve(song);
    }).catch(function (error) {
        deferred.reject(error);
    });
    return deferred.promise;
};

exports.getInfoAboutSong = getInfoAboutSong;