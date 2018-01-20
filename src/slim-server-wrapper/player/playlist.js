var Q = require("q");
var SlimRequest = require('../slim-request');

var getTrackIndex = function(idPlayer) {
    var deferred = Q.defer();
    SlimRequest.slimRequest([idPlayer, ['playlist', 'index', '?']]).then(function(result){
        deferred.resolve(result._index);
    }, function(error) {
        deferred.reject(error);
    });
    return deferred.promise;
};

var setTrackIndex = function(idPlayer, trackIndex) {
    var deferred = Q.defer();
    SlimRequest.slimRequest([idPlayer, ['playlist', 'index', trackIndex]]).then(function(){
        deferred.resolve({});
    }, function(error) {
        deferred.reject(error);
    });
    return deferred.promise;
};

exports.getTrackIndex = getTrackIndex;
exports.setTrackIndex = setTrackIndex;