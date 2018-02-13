# rest-api-squeezebox

## Abstract
This REST API, which runs on nodejs, is a translation of the slimserver / logitech squeezebox server Web RPC API.
Why I do that ? Just beacause it'll be simpler to make mobile app, or actually for me it's to have nicer http requests in IFTTT that I use with my google home mini. I use it to say "Musique dans la salle" or "Chanson suivante" or "Volume à 75 dans la salle" and it's fun ;-)

## Notice
To install, just run "npm install". 
To launch the API, run "npm start".

But, it is very possible you have to change the "script" in your case. 

In fact, notice in package.json the start script is "node src/index.js 192.168.1.12:2311 2312". Usualy, the squeezebox server is 9000, not 2311, and your squeezebox sever is certainly not on 192.168.1.12.
Personnaly, I don't use the default port (9000) for my server, just for security reason.

2312 in the command line means that the API will be accessible in the 2312 port. Of course, you can change it for 8080.

Notice too a file (src/api/token.js) is not shared on github. You have to create this file which must contain the variable "token". It is used like a password. You will add it in every http request with the query param "token" (like GET /players?token=toto). So the file token.js is like :
```
exports.token = "what-a-token";
```
It's not a good solution for security. It is just for waiting for a better solution.

## Endpoint that you can use

### GET /players to know your players on your multi-room logitech squeezebox system
Get players informations. The array returned looks like :
```
[
    {
        "uuid": "********************************",
        "name": "salle 1",
        "id": "**:**:**:**:**:**",
        "ip": "192.168.*.*:*****",
        "model": "Squeezebox Touch",
        "firmwareVersion": "7.8.0-r16754",
        "signalStrength": 90,
        "playState": "pause",
        "mixer": {
            "power": "on",
            "volume": "50",
            "bass": "50",
            "treble": "50"
        },
        "songPlayed": {
            "indexInPlaylist": "1",
            "secondsPlayed": 27.2640468654633,
            "duration": "210.546",
            "artist": "Blue Öyster Cult",
            "album": "Blue Oyster Cult",
            "title": "Then Came the Last Days of May",
            "isRemote": true,
            "path": "spotify://track:60TYdVs6TWIsAJ1MPRdv59"
        }
    },
    {
        "uuid": "********************************",
        "name": "salle 2",
        "id": "**:**:**:**:**:**",
        "ip": "192.168.*.*:*****",
        "model": "Squeezebox Radio",
        "firmwareVersion": "7.7.3-r16676",
        "signalStrength": 63,
        "playState": "stop",
        "mixer": {
            "power": "off",
            "volume": "22",
            "bass": "50",
            "treble": "50"
        },
        "songPlayed": {
            "indexInPlaylist": "1",
            "secondsPlayed": 27.2640468654633,
            "duration": "210.546",
            "artist": "Blue Öyster Cult",
            "album": "Blue Oyster Cult",
            "title": "Then Came the Last Days of May",
            "isRemote": true,
            "path": "spotify://track:60TYdVs6TWIsAJ1MPRdv59"
        }
    }
]
```

### GET /players/{uuid} just to have the information to display
Get informations for one player. The object returned looks like : 
```
{
    "uuid": "********************************",
    "name": "salle 1",
    "id": "**:**:**:**:**:**",
    "ip": "192.168.*.*:*****",
    "model": "Squeezebox Touch",
    "firmwareVersion": "7.8.0-r16754",
    "signalStrength": 90,
    "playState": "pause",
    "mixer": {
        "power": "on",
        "volume": "50",
        "bass": "50",
        "treble": "50"
    },
    "songPlayed": {
        "indexInPlaylist": "1",
        "secondsPlayed": 27.2640468654633,
        "duration": "210.546",
        "artist": "Blue Öyster Cult",
        "album": "Blue Oyster Cult",
        "title": "Then Came the Last Days of May",
        "isRemote": true,
        "path": "spotify://track:60TYdVs6TWIsAJ1MPRdv59"
    }
}
```

### PATCH /players/{uuid} to play or stop your music, or to change the song to play
Actually, you just can change the value of play_state and the index_in_playlist of the song_currently_played object. So the body of the request could look like  :
```
{
    "play_state": "play", // can be play, pause or stop
    "song_currently_played" : {
        "index_in_playlist" : 4
    }
}
```
If you change the value of play_state of you player, it will play or stop the music on your player.
Notice that it's possible to change the song played for the next in playlist, if you send "+1" for song_currently_played.index_in_playlist.

### PATCH /players/{uuid}/mixer to turn off or on a player ou just to change the volume
PATCH /players/{uuid}/mixer is to patch the mixer :-). So you can use it to turn on or off your player, or change volume, bass and treble. For example, if you want turn off your player, you can send :
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
