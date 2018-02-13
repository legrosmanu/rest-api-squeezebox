let request = require('request');

let slimServerURL = null;

module.exports = class SlimHelper {

    static sendRequest(requestParams) {
        return new Promise((resolve, reject) => {
            request({
                url: slimServerURL,
                method: "POST",
                json: true,
                body: {
                    id: 1,
                    method: 'slim.request',
                    params: requestParams
                }
            }, (error, response, body) => {
                if (error) {
                    console.log("Error SlimHelper.sendRequest : " + error);
                    reject(error);
                } else {
                    resolve(body.result);
                }
            });
        });
    }

    static setUrl(url) {
        slimServerURL = 'http://' + url + '/jsonrpc.js';
    }

}