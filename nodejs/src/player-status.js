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

var getPlayStatus = function (player) {
    var deferred = Q.defer();
    var playStatus = {};
    Q.fcall(function () {
        return slimServer.getPlayMode(player.id);
    }).then(function (mode) {
        playStatus.state = mode;
        playStatus.song_currently_playing = {};
        return slimServer.getSecondsPlayed(player.id);
    }).then(function (seconds) {
        playStatus.song_currently_playing.seconds_played = seconds;
        return slimServer.getInfoAboutSong(player.id);
    }).then(function (song) {
        playStatus.song_currently_playing.duration = song.duration;
        playStatus.song_currently_playing.artist = song.artist;
        playStatus.song_currently_playing.album = song.album;
        playStatus.song_currently_playing.title = song.title;
        deferred.resolve(playStatus);
    }).catch(function (err) {
        console.log("Error on getPlayStatus / player-status : " + err);
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.getMixer = getMixer;
exports.getPlayStatus = getPlayStatus;