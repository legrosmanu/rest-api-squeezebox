let SlimHelper = require('../slim-server-wrapper/SlimHelper');

module.exports = class Mixer {

    constructor(player) {
        this.player = player;
    }

    async init() {
        const data = await Promise.all([
            SlimHelper.sendRequest([this.player.id, ['power', '?']]),
            SlimHelper.sendRequest([this.player.id, ['mixer', 'volume', '?']]),
            SlimHelper.sendRequest([this.player.id, ['mixer', 'bass', '?']]),
            SlimHelper.sendRequest([this.player.id, ['mixer', 'treble', '?']])
        ]);
        this.power = (data[0]._power) ? "on" : "off";
        this.volume = data[1]._volume;
        this.bass = data[2]._bass;
        this.treble = data[3]._treble;
    }

}