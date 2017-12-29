var slimServer = require('./slim-server-wrapper');
var Q = require("q");

var getMixer = function (player) {
    var deferred = Q.defer();
    var mixer = {};
    Q.fcall(function () {
        return slimServer.getVolume(player.id);
    }).then(function (volume) {
        mixer.volume = volume;
        return slimServer.getBass(player.id);
    }).then(function (bass) {
        mixer.bass = bass;
        return slimServer.getTreble(player.id);
    }).then(function (treble) {
        mixer.treble = treble;
        return slimServer.getPower(player.id);
    }).then(function (power) {
        mixer.power = power;
        deferred.resolve(mixer);
    }).catch(function (err) {
        console.log("Error catched getMixer / player-status : " + err);
        deferred.reject(err);
    });
    return deferred.promise;
};

var getReadStatus = function (player) {
    var deferred = Q.defer();
    var readStatus = {};
    Q.fcall(function () {
        return slimServer.getReadMode(player.id);
    }).then(function (mode) {
        readStatus.state = mode;
        readStatus.song_currently_playing = {};
        return slimServer.getSecondsRead(player.id);
    }).then(function (seconds) {
        readStatus.song_currently_playing.seconds_read = seconds;
        return slimServer.getInfoAboutSong(player.id);
    }).then(function (song) {
        readStatus.song_currently_playing.duration = song.duration;
        readStatus.song_currently_playing.artist = song.artist;
        readStatus.song_currently_playing.album = song.album;
        readStatus.song_currently_playing.title = song.title;
        deferred.resolve(readStatus);
    }).catch(function (err) {
        console.log("Error on getReadStatus / player-status : " + err);
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.getMixer = getMixer;
exports.getReadStatus = getReadStatus;