'use strict'
const {spawn} = require('child_process'),
	debug = require('debug')('node-docker-build'),
	processList = {}

const exec = args => {
	var {detach} = args
	detach === false ? callSync(args) : call(args)
}

const call = ({script, configModule, repo, cwd, logPath, domain}) => {
	var startProcess = `node ${script} ${repo||configModule} ${domain||''} > ${logPath}_${script}.log 2>&1`
	debug(`spawn command: ${startProcess}`)
	if(processList[script]){
		processList[script].kill('SIGKILL')
	}
	processList[script] = spawn(
		startProcess,
		{
			cwd:cwd||__dirname,
			shell:true,
			detach:true,
			stdio:'ignore',
			env:{...process.env, NODE_ENV:'development'}
		}
	)
}

const callSync = ({script, configModule, repo, domain, cwd}) => {
	var startProcess = `node ${script} ${repo||configModule} ${domain||''}`
	debug(`spawn command: ${startProcess}`)
	spawn(
		startProcess,
		{
			cwd:cwd||__dirname,
			shell:true,
			stdio:'inherit',
			env:{...process.env, NODE_ENV:'development'}
		}
	)
}

module.exports = {
	singletonExec: config => exec({...config}),
	build: config => exec({script:'build', ...config}),
	deploy: config => exec({script:'deploy', ...config}),
	buildDeploy: config => exec({script:'build-deploy', ...config})
}