'use strict'
const spawn = require('await-spawn'),
	debug = require('debug')('node-docker-build')

const exec = args => {
	var {detach, one} = args
	detach === false ? callSync(args, one) : call(args, one)
}

const call = ({script, configModule, repo, cwd, logPath, domain}, one) => {
	var startProcess = `node ${script} ${repo||configModule} ${one||'_all_'} ${domain||''}  > ${logPath}_${script}.log 2>&1`
	debug(`spawn command: ${startProcess}`)
	spawn(startProcess, {
		cwd:cwd||__dirname,
		shell:true,
		detach:true,
		stdio:'ignore',
		env:{...process.env, NODE_ENV:'production'}
	})
}

const callSync = ({script, configModule, repo, domain, cwd}, one) => {
	var startProcess = `node ${script} ${repo||configModule} ${one||'_all_'} ${domain||''}`
	debug(`spawn command: ${startProcess}`)
	spawn(startProcess,	{
		cwd:cwd||__dirname,
		shell:true,
		stdio:'inherit',
		env:{...process.env, NODE_ENV:'production'}
	})
}

module.exports = {
	singletonExec: config => exec({...config}),
	build: config => exec({script:'build', ...config}),
	deploy: config => exec({script:'deploy', ...config}),
	buildDeploy: config => exec({script:'build-deploy', ...config})
}