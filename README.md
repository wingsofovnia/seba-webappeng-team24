## Evaluati.one

<p align="center">
<img width="300" src="https://user-images.githubusercontent.com/5632544/27002864-1f3e18bc-4dec-11e7-9cd3-3d3124ee4866.png">
</p>

**Evaluati.one** is a platform for gathering feedback on employees to help companies to assess personnel competencies and proficiency with employees self-review processes that encourage their engagement in personal development.

This is developed during the [Web Application Engineering Master Course](https://wwwmatthes.in.tum.de/pages/1mqqqoqe7gapz/SEBA-Master-Web-Application-Engineering) at TUM that provides the necessary theoretical foundations to design and develop state-of-the art web applications. Next to the technical aspects to develop applications for the web, business aspects are covered with the most common business models and explained with real-world examples.

## Motivation

Learn how to design web sites from the scratch including patterns for recurring problems. Technical aspects for the development of web applications are presented along with generic platforms and architectures.

## Getting Started

The app itself consists of two independent parts: backend (API) server and frontend.
### Backend

```
# Install dependencies
npm install

#Run Mongodb
mongod --db-path <path-to-db-folder>

# Start development live-reload server
# only run after starting up the DB
env PORT=8000 npm run dev

# Start production server:
env PORT=8080 npm start
```

### Frontend
```
cd frontend

# Install dependencies
npm install

# Build assest
npm run build 

# Watch the assets
npm run watch 

# Start server:
npm run start

#Start dev server:
npm run start-dev
```

#### Docker-Compose
```
# Run the development stack from the root directory of seba

docker-compose up 

# you might also use the --build flag if you want to 
# rebuild the images.
# use the -d flag to run everything as a daemon.
# Both the frontend and the backend code should be available
# and hot reloadable.
# PORTS are 8080 for the backend 8000 for the frontend

# Kill the development stack 

docker-compose down

# NOTES:

# First add a company, then register a user with the right domain
# finally login with the username + password
# Simple API Link (not complete): https://documenter.getpostman.com/view/1033727/evaluatione/6Z6sAsy 

# docker by default creates lots of junk such as orphan containers and images
# run the docker-gc container to get rid all that junk

docker pull spotify/docker-gc

# and then run

docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v /etc:/etc:ro spotify/docker-gc

#everytime you want to remove the junk.

```

# Build your docker
```
docker build -t seba/evaluati-one .
#            ^       ^            ^
#          tag   tag name   Dockerfile location

# run your docker
docker run -p 8080:8080 seba/evaluati-one
#                 ^            ^
#          bind the port    container tag
#          to your host
#          machine port  
```

## Credits

Backend is based on [Express & ES6 REST API Boilerplate](https://github.com/developit/express-es6-rest-api).

## License

Except where noted, software in this repository is licensed under the terms of the [MIT License](https://opensource.org/licenses/MIT).
