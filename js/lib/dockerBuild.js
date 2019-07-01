'use strict'
const path = require('path'),
	{DOCKER_HOST} =  process.env,
	cp = require('child_process'),
	buildArg = require('./buildArgs')

module.exports = config => new Promise((res, rej) => {
	var {repository, domain, target, buildArgs, push} = config,
		{scope, name, domainDir} = repository,
		{home} = target,
		subPath = `${scope}/${name}/${domainDir}/${domain}`,
		dir = path.resolve(config.baseDir, subPath),
		compose = cmd => DOCKER_HOST ?
			`docker run --rm -v /var/run/:/var/run -v ${home}:${home} -v ${home}:/root -v domains:/wd -w /wd/${subPath} docker/compose:1.23.2 ${cmd}`
			: `docker-compose ${cmd}`,
		pushCommand = push ? ` && ${compose('push')} --ignore-push-failures ` : '',
		command = `${compose('build')}${buildArgs ? buildArg(buildArgs):''}${pushCommand}`

	cp.spawn( command, {cwd:dir, stdio:'inherit', shell:true} )
		.on('exit', code => code === 0 ? res() : rej())
		.on('error', err => rej(err))
})