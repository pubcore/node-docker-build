'use strict'
const {DOCKER_HOST} =  process.env,
	cp = require('child_process'),
	buildArg = require('./buildArgs'),
	{platform} = require('os'),
	{basename, resolve} = require('path')

module.exports = config => new Promise((res, rej) => {
	var {domain, target, buildArgs, push, buildCache, workingDir} = config,
		name = basename(resolve(workingDir, '../../')),
		{home} = target || {},
		subPath = `${name}/domains/${domain}`,
		compose = (cmd, args='') => (
			DOCKER_HOST ?
				`docker run --rm -v /var/run/:/var/run -v ${home}:${home} -v ${home}:/root -v domains:/wd -w /wd/${subPath} docker/compose:1.23.2`
				: 'docker-compose'
		) + ` ${args} ${cmd} ${(cmd==='build' && buildArgs) ? buildArg(buildArgs):''}`,
		buildCacheCommand = buildCache ? `${compose('build', '-f docker-compose-build-cache.yml')} && ` : '',
		pushCommand = push ? ` && ${compose('push')} --ignore-push-failures ` : '',
		exe = platform() === 'win32' ? 'PowerShell.exe -NonInteractive -Command ' : '',
		command = `${exe}${buildCacheCommand}${compose('build')}${pushCommand}`

	console.log(command)
	cp.spawn( command, {cwd:workingDir, stdio:'inherit', shell:true} )
		.on('exit', code => code === 0 ? res() : rej(new Error({code})))
		.on('error', err => rej(new Error(err)))
})
