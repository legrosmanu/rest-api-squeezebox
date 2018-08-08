let SlimHelper = require('../../slim-server-wrapper/SlimHelper');
let Mixer = require('./Mixer');
let SongPlayed = require('./SongPlayed');
let Playlist = require('./Playlist');

module.exports = class Player {

    constructor(uuid) {
        this.uuid = uuid;
    }

    // Call slim server to get the data for this player.
    // uuid is not an id for the rpc api to get the data. So, we have to check how much we have players to get all the players, 
    // then find the player with this uuid.
    // After that, we can get the data.
    async init() {


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
                codeHTTP: 404,
                message: "player not found on Player.init() " + this.uuid
            };
            throw error;
        } else {
            this.name = player.name;
            this.id = player.playerid;
            this.ip = player.ip;
            this.model = player.modelname;
            this.firmwareVersion = player.firmware;

            this.playlist = new Playlist(this);

            this.mixer = new Mixer(this);
            this.songPlayed = new SongPlayed(this);
            const data = await Promise.all([
                SlimHelper.sendRequest([this.id, ['signalstrength', '?']]),
                SlimHelper.sendRequest([this.id, ['mode', '?']]),
                this.mixer.init(),
                this.songPlayed.init()
            ]);
            this.signalStrength = data[0]._signalstrength;
            this.playState = data[1]._mode;
        }

    }


    getMixer() {
        return this.mixer;
    }

    getSongPlayed() {
        return this.songPlayed;
    }

    getPlaylist() {
        return this.playlist;
    }

    // newState can be on or off
    async setPower(newState) {
        if (newState === "on" || newState === "off") {
            await this.mixer.setPower(newState);
        } else {
            let error = {
                codeHTTP: 400,
                message: "the power for the player " + this.uuid + " has to be on or off"
            };
            throw error;
        }
    }

    // newState can be play, stop or pause
    async setPlayState(newState) {
        if (newState === "play" || newState === "stop" || newState === "pause") {
            this.playState = newState;
            await SlimHelper.sendRequest([this.id, ['mode', this.playState]]);
        } else {
            let error = {
                codeHTTP: 400,
                message: "the play state for the player " + this.uuid + " has to be play, stop or pause"
            };
            throw error;
        }
    }

    toAPI() {
        return {
            uuid: this.uuid,
            name: this.name,
            id: this.id,
            ip: this.ip,
            model: this.model,
            firmware_version: this.firmwareVersion,
            signal_strength: this.signalStrength,
            play_state: this.playState,
            mixer: this.mixer.toAPI(),
            song_currently_played: this.songPlayed.toAPI()
        };
    }

}