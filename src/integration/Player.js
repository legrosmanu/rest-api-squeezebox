let SlimHelper = require('../slim-server-wrapper/SlimHelper');
let Mixer = require('./Mixer');
let songPlayed = require('./SongPlayed');

module.exports = class Player {

    constructor(uuid) {
        this.uuid = uuid;
    }

    // Call slim server to get the data for this player.
    // uuid is not an id for the rpc api to get the data. So, we have to check how much we have players to get all the players, 
    // then find the player with this uuid.
    // After that, we can get the data.
    async init() {

        try {

            const resultNbPlayers = await SlimHelper.sendRequest(['-', ['player', 'count', '?']]);

            const resultPlayers = await SlimHelper.sendRequest(['-', ['players', '0', resultNbPlayers._count]]);

            let player = null;
            for (let it = 0; it < resultPlayers.players_loop.length && player === null; it++) {
                if (resultPlayers.players_loop[it].uuid === this.uuid) {
                    player = resultPlayers.players_loop[it];
                }
            }

            if (player === null) {
                let error = {
                    codeHttp: 404,
                    message: "player nont found on Player.init() " + this.uuid
                };
                throw error;
            } else {
                this.name = player.name;
                this.id = player.playerid;
                this.ip = player.ip;
                this.model = player.modelname;
                this.firmwareVersion = player.firmware;

                let mixer = new Mixer(this);
                let songPlayedOnPlayer = new songPlayed(this);
                const data = await Promise.all([
                    SlimHelper.sendRequest([this.id, ['signalstrength', '?']]),
                    SlimHelper.sendRequest([this.id, ['mode', '?']]),
                    mixer.init(),
                    songPlayedOnPlayer.init()
                ]);
                this.signalStrength = data[0]._signalstrength;
                this.playState = data[1]._mode;
                this.mixer = {
                    power: mixer.power,
                    volume: mixer.volume,
                    bass: mixer.bass,
                    treble: mixer.treble
                };
                this.songPlayed = Object.assign({}, songPlayedOnPlayer, { player: undefined });
            }

        } catch (error) {
            console.log("Error on Player.init() for the uuid " + this.uuid + " " + error);
        }

    }

    // newState can be on or off
    setPower(newState) {
        // TODO
    }

    // newState can be play, stop or off
    setPlayState(newState) {
        // TODO
    }

    setMixer(newMixer) {
        // TODO
    }

    nextTrack() {
        // TODO
    }

    previousTrack() {
        // TODO
    }

    setIndexSongPlayedOnPlaylist() {
        // TODO
    }

}