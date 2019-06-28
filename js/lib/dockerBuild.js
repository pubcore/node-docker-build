'use strict'
const path = require('path'),
	{DOCKER_HOST} =  process.env,
	cp = require('child_process')

module.exports = config => new Promise((res, rej) => {
	if(config.domain === 'host.docker.internal' ){
		return res(console.log('skip docker build, not required on local system'))
	}
	
	var {scope, name, domainDir} = config.repository,
		{home} = config.target,
		subPath = `${scope}/${name}/${domainDir}/${config.domain}`,
		dir = path.resolve(config.baseDir, subPath),
		compose = cmd => DOCKER_HOST ?
			`docker run --rm -v /var/run/:/var/run -v ${home}:${home} -v ${home}:/root -v domains:/wd -w /wd/${subPath} docker/compose:1.23.2 ${cmd}`
			: `docker-compose ${cmd}`,
		command = `${compose('build')} && ${compose('push')}`

	console.log(command)
	cp.spawn( command, {cwd:dir, stdio:'inherit', shell:true} )
		.on('exit', code => code === 0 ? res() : rej())
		.on('error', err => rej(err))
})