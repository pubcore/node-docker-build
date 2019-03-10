'use strict'
const path = require('path'),
	compose = (command, path) => process.env.DOCKER_HOST ?
		`docker run --rm -v /var/run/:/var/run -v domains:/wd -i -w /wd/${path} docker/compose:1.23.2 ${command}`
		: `docker-compose ${command}`,
	cp = require('child_process')

module.exports = config => new Promise((res, rej) => {
	var {scope, name} = config.repository,
		subPath = `${scope}/${name}/${config.domain}`,
		dir = path.resolve(config.baseDir, subPath)

	cp.spawn(
		`${compose('build', subPath)} && ${compose('push', subPath)}`,
		{cwd:dir, stdio:'inherit', shell:true}
	).on('exit', code => code === 0 ? res() : rej())
		.on('error', err => rej(err))
})