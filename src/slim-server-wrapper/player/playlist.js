var Q = require("q");
var SlimRequest = require('../slim-request');

var setTrackIndex = function(idPlayer, trackIndex) {
    var deferred = Q.defer();
    SlimRequest.slimRequest([idPlayer, ['playlist', 'index', trackIndex]]).then(function(){
        deferred.resolve({});
    }, function(error) {
        deferred.reject(error);
    });
    return deferred.promise;
};

exports.setTrackIndex = setTrackIndex;