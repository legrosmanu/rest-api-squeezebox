var SlimServer = require('./slim-server-wrapper');
var Q = require("q");
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
            return SlimServer.getSignalStrength(player.id);
        }
    }).then(function (signalStrength) {
        player.signal_strength = signalStrength;
        return getMixer(player);
    }).then(function (mixer) {
        player.mixer = mixer;
        return SlimServer.getPlayMode(player.id);
    }).then(function (mode) {
        player.play_state = mode;
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

/******************************
 * Private function
 * 
 * 
 *****************************/
var getMixer = function (player) {
    var deferred = Q.defer();
    var mixer = {};
    Q.fcall(function () {
        return SlimServer.getVolume(player.id);
    }).then(function (volume) {
        mixer.volume = volume;
        return SlimServer.getBass(player.id);
    }).then(function (bass) {
        mixer.bass = bass;
        return SlimServer.getTreble(player.id);
    }).then(function (treble) {
        mixer.treble = treble;
        return SlimServer.getPower(player.id);
    }).then(function (power) {
        mixer.power = power;
        deferred.resolve(mixer);
    }).catch(function (err) {
        console.log("Error catched getMixer : " + err);
        deferred.reject(err);
    });
    return deferred.promise;
};

var getSongPlaying = function (player) {
    var deferred = Q.defer();
    var songCurrentlyPlaying = {};
    SlimServer.getInfoAboutSong(player.id).then(function (song) {
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