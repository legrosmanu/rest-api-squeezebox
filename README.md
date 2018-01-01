# rest-api-squeezebox

## Abstract
This REST API, which runs on nodejs, is a translation of the slimserver / logitech squeezebox server Web RPC API.

## Notice
To install, just run "npm install". 
To launch the API, run "npm start".

But, it is very possible you have to change the "script" in your case. 

In fact, notice on package.json the start script is "node src/index.js 192.168.1.12:2311 2312". Usualy, the squeezebox server is 9000, not 2311, and your squeezebox sever is certainly not on 192.168.1.12.
Personnaly, I don't use the default port (9000) for my server, just for security reason.

2312 on the command line means that the API will be accessible on the 2312 port. Of course, you can change it for 8080.

Notice too a file (src/api/token.js) is not shared on github. You have to create this file which must contain the variable "token". It is used like a password. You will add it on every http request with the query param "token" (like GET /players?token=toto). So the file token.js is like :
```
exports.token = "what-a-token";
```
It's not a good solution for security. It is just for waiting for a better solution.

## Endpoint that you can use
- GET /players : get players informations. The array returned looks like :
```
[
    {
        "name": "Musique salle de bain",
        "uuid": "********************************",
        "id": "**:**:**:**:**:**",
        "ip": "192.168.*.*:*****",
        "model": "Squeezebox Radio",
        "firmware_version": "7.7.3-r16676"
    },
    {
        "name": "Salle ChachaManu",
        "uuid": "********************************",
        "id": "**:**:**:**:**:**",
        "ip": "192.168.*.*:*****",
        "model": "Squeezebox Touch",
        "firmware_version": "7.8.0-r16754"
    }
]
```
- GET /players/{uuid} : get informations for one player. The object returned looks like : 
```
{
    "name": "Musique salle de bain",
    "uuid": "********************************",
    "id": "**:**:**:**:**:**",
    "ip": "192.168.*.*:*****",
    "model": "Squeezebox Radio",
    "firmware_version": "7.7.3-r16676",
    "signal_strength": 88,
    "mixer": {
        "volume": "42",
        "bass": "50",
        "treble": "50",
        "power": "on"
    },
    "play_state": "pause",
    "song_currently_playing": {
        "seconds_played": 183.890504037857,
        "duration": "258.466",
        "artist": "The Smashing Pumpkins",
        "album": "Mellon Collie and the Infinite Sadness (2012 - Remaster)",
        "title": "Bullet With Butterfly Wings",
        "is_remote": true,
        "path": "spotify://track:4qMzPtAZe0C9KWpWIzvZAP"
    }
}
```
- PATCH /players/{uuid} to only change the value of play_state for a player object. So the body of the request has to be something like :
```
{
	"play_state": "play" // can be play, pause or stop
}
```
If you change the value of play_state of you player, it will play or stop the music on your player.

- PATH /players/{uuid}/mixer is to patch the miwer :-). So you can use it to turn on or off your player, or change volume, bass and treble. For example, if you want turn off your player, you can send :
```
{
    "power": "off"
}
```
Or, if you want to change the volume : 
```
{
    "volume": "15"
}
```
Refer to the GET /players/{uuid} to see what is the mixer object.