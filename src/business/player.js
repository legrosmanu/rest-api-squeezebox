var Q = require("q");
var SlimServerPlayerMixer = require('../slim-server-wrapper/player/mixer');
var SlimServerPlayerState = require('../slim-server-wrapper/player/play-state');
var SlimServerSongPlaying = require('../slim-server-wrapper/player/song-playing');
var Players = require('./players');

var getPlayer = function (uuid) {
    var deferred = Q.defer();
    var player = null;
    Q.fcall(function () {
        return Players.getAllPlayers();
    }).then(function (players) {
        try {
            for (var i = 0; i < players.length && player === null; i++) {
                if (players[i].uuid === uuid) {
                    player = players[i];
                }
            }
        } catch (err) {
            deferred.reject(err);
        }
        if (player === null) {
            deferred.resolve(null);
        } else {
            return SlimServerPlayerMixer.getSignalStrength(player.id);
        }
    }).then(function (signalStrength) {
        player.signal_strength = signalStrength;
        return getMixer(player);
    }).then(function (mixer) {
        player.mixer = mixer;
        return SlimServerPlayerState.getPlayState(player.id);
    }).then(function (state) {
        player.play_state = state;
        return getSongPlaying(player);
    }).then(function (song) {
        player.song_currently_playing = song;
        deferred.resolve(player);
    }).catch(function (error) {
        console.log("Error getPlayer : " + error);
        deferred.reject(error);
    });
    return deferred.promise;
};

var setPlayState = function (player, newValue) {
    var deferred = Q.defer();
    if (newValue === "stop" || newValue === "pause" || newValue === "play") {
        SlimServerPlayerState.setPlayState(player.id, newValue).then(function() {
            deferred.resolve(newValue);
        }, function(err) {
            deferred.reject({
                error : 500,
                message : err
            });
        });
    } else {
        deferred.reject({
            error : 400,
            message : 'The value ' + newValue + ' is not accepted.'
        });
    }
    return deferred.promise;
};

var updateMixer = function(player, newMixer) {
    var deferred = Q.defer();
    try {
        SlimServerPlayerMixer.setVolume(player.id, newMixer.volume)
        .then(SlimServerPlayerMixer.setBass(player.id, newMixer.bass))
        .then(SlimServerPlayerMixer.setTreble(player.id, newMixer.treble))
        .then(SlimServerPlayerMixer.setPower(player.id, newMixer.power))
        .then(function() {
            deferred.resolve({});
        })
        .fail(function(error) {
            deferred.reject(error);
        });
    } catch (error) {
        deferred.reject(error);
    }
    return deferred.promise;
};

/******************************
 * Private function
 * 
 * 
 *****************************/
var getMixer = function (player) {
    var deferred = Q.defer();
    var mixer = {};
    Q.fcall(function () {
        return SlimServerPlayerMixer.getVolume(player.id);
    }).then(function (volume) {
        mixer.volume = volume;
        return SlimServerPlayerMixer.getBass(player.id);
    }).then(function (bass) {
        mixer.bass = bass;
        return SlimServerPlayerMixer.getTreble(player.id);
    }).then(function (treble) {
        mixer.treble = treble;
        return SlimServerPlayerMixer.getPower(player.id);
    }).then(function (power) {
        mixer.power = power;
        deferred.resolve(mixer);
    }).catch(function (err) {
        console.log("Error getMixer : " + err);
        deferred.reject(err);
    });
    return deferred.promise;
};

var getSongPlaying = function (player) {
    var deferred = Q.defer();
    var songCurrentlyPlaying = {};
    SlimServerSongPlaying.getInfoAboutSong(player.id).then(function (song) {
        try {
            songCurrentlyPlaying.seconds_played = song.secondsPlayed;
            songCurrentlyPlaying.duration = song.duration;
            songCurrentlyPlaying.artist = song.artist;
            songCurrentlyPlaying.album = song.album;
            songCurrentlyPlaying.title = song.title;
            songCurrentlyPlaying.is_remote = song.isRemote;
            songCurrentlyPlaying.path = song.path;
            deferred.resolve(songCurrentlyPlaying);
        } catch (err) {
            console.log("Error on getSongPlaying / result for getInfoAboutSong : " + err);
            deferred.reject(err);
        }
    }, function (err) {
        console.log("Error on getSongPlaying : " + err);
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.getPlayer = getPlayer;
exports.setPlayState = setPlayState;
exports.updateMixer = updateMixer;