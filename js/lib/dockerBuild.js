'use strict'
const buildArg = require('./buildArgs'),
	{platform} = require('os'),
	{basename, resolve} = require('path'),
	dockerCompose = require('./dockerCompose'),
	spawnCommand = require('./spawnCommand')

module.exports = async config => {
	var {domain, target, buildArgs, push, buildCache, workingDir} = config,
		name = basename(resolve(workingDir, '../../')),
		{home} = target || {},
		subPath = `${name}/domains/${domain}`,
		compose = (cmd, args='') =>
			`${dockerCompose(home, subPath)} ${args} ${cmd} ${cmd==='build' ?
				`${buildArg(buildArgs)} --parallel ` :
				''}`,
		buildCacheCommand = buildCache ? `${compose('build', '-f docker-compose-build-cache.yml')} && ` : '',
		pushCommand = push ? ` && ${compose('push')} --ignore-push-failures ` : '',
		exe = platform() === 'win32' ? 'PowerShell.exe -NonInteractive -Command ' : '',
		command = `${exe}${buildCacheCommand}${compose('build')}${pushCommand}`

	await spawnCommand(command, workingDir)
}
