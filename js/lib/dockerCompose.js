'use strict'

const {DOCKER_HOST} =  process.env

module.exports = (home, dir) => DOCKER_HOST ?
	`docker run --rm -v /var/run/:/var/run -v ${home}:${home} -v ${home}:/root -v domains:/wd -w /wd/${dir} docker/compose:1.23.2`
	: 'docker-compose'