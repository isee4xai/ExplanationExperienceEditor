# iSee Explanation Experience Editor (E3)

## Run using Docker

[Install docker](https://docs.docker.com/get-docker/) in your machine if you dont have already.
 
Build image

```
docker build --tag iseetool .
```

Run for the first time

```
docker run -p 8000:8000 --name iseetoolcont iseetool
```

Run afterwards

```
docker start iseetoolcont -i
```

Goto 
[http://localhost:8000/](http://localhost:8000/) to use the application

For the editor functionalities to work properly, **launch the Json Server**:

Install JSON Server

```
npm install -g json-server
```

Go to the _ServerJson_ folder and start JSON Server

```
json-server --watch db.json
```

Now if you go to 
[http://localhost:3000/projects/5](http://localhost:3000/projects/5) , you'll get

```
{
  "name": "proyecto 1.2",
  "description": "",
  "data": {
    "version": "0.1.0",
    "scope": "project",
    "selectedTree": "6c8e88b5-e06c-4a3e-a68b-624951498007",
    "trees": [
      {
        "version": "0.1.0",
        "scope": "tree",
        "id": "6c8e88b5-e06c-4a3e-a68b-624951498007",
        "title": "proyecto 5",
        "description": "",
        "root": null,
        "properties": {},
        "nodes": {},
        "display": {
          "camera_x": 381.5,
          "camera_y": 328.5,
          "camera_z": 1,
          "x": 0,
          "y": 0
        }
      }
    ],
    "custom_nodes": []
  },
  "path": "b3projects-512f96d6-d694-4e40-8cfb-a09147c9c622",
  "id": 5,
  "date": "2022-5-12 13:4:11"
}
```

More information
[https://github.com/typicode/json-server](https://github.com/typicode/json-server) 


This software is based on the behaviour3editor project https://github.com/behavior3/behavior3editor/, created by:
Copyright (c) 2014 Renato de Pontes Pereira
and publised under the MIT license

