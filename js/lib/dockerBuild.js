'use strict'
const buildArg = require('./buildArgs'),
	{platform} = require('os'),
	{basename, resolve} = require('path'),
	dockerCompose = require('./dockerCompose'),
	spawn = require('await-spawn')

module.exports = async (config, one) => {
	var {domain, target, buildArgs, push, workingDir, forcePull, buildKit} = config,
		name = basename(resolve(workingDir, '../../')),
		serivce = one && one!=='_all_' ? one : '',
		{home} = target || {},
		subPath = `${name}/domains/${domain}`,
		compose = cmd =>
			`${buildKit ? 'COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 ':''}${dockerCompose(home, subPath)} ${cmd} ${cmd==='build' ?
				`${buildKit ? '':'--parallel '}${forcePull ? '--pull ' : ''} ${buildArg(buildArgs)} ${serivce}`
				: ''}`,
		pushCommand = push ? ` && ${compose('push')} --ignore-push-failures ${serivce}` : '',
		exe = platform() === 'win32' ? 'PowerShell.exe -NonInteractive -Command ' : '',
		command = `${exe}${compose('build')}${pushCommand}`

	await spawn(command, {cwd:workingDir, stdio:'inherit', shell:true})
}
