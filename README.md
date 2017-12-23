# rest-api-squeezebox
This REST API is a translation of the slimserver / logitech squeezebox server JSON RPC API.

For now, you can find a nodeJS version on nodejs directory.
For this version, notice on package.json the start script. Usualy, the squeezebox server is 9000, not 2311. I don't use the default port (9000) for my server, just for security reason.

Endpoint that you can use :
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
    "mixer": {
        "volume": "42",
        "bass": "50",
        "treble": "50"
    }
}
```
