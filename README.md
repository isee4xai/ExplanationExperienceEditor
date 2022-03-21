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
