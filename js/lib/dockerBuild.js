'use strict'
const buildArg = require('./buildArgs'),
	{platform} = require('os'),
	{basename, resolve} = require('path'),
	dockerCompose = require('./dockerCompose'),
	spawnCommand = require('./spawnCommand')

module.exports = async (config, one) => {
	var {domain, target, buildArgs, push, workingDir, forcePull, buildKit} = config,
		name = basename(resolve(workingDir, '../../')),
		serivce = one && one!=='_all_' ? one : '',
		{home} = target || {},
		subPath = `${name}/domains/${domain}`,
		compose = cmd =>
			`${buildKit?'DOCKER_BUILDKIT=1 ':''}${dockerCompose(home, subPath)} ${cmd} ${cmd==='build' ?
				`${forcePull ? '--pull' : ''} ${buildArg(buildArgs)} --parallel ${serivce}`
				: ''}`,
		pushCommand = push ? ` && ${compose('push')} --ignore-push-failures ${serivce}` : '',
		exe = platform() === 'win32' ? 'PowerShell.exe -NonInteractive -Command ' : '',
		command = `${exe}${compose('build')}${pushCommand}`

	await spawnCommand(command, workingDir)
}
