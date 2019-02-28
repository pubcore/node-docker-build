'use strict'
const {spawn} = require('child_process'),
	debug = require('debug')('node-docker-build'),
	processList = {}

const call = ({script, moduleName, domain, logPath, cwd}) => {
	var startProcess =
		`node ${script} ${moduleName} ${domain} > ${logPath||'../'}_${script}.log 2>&1`

	if(processList[script]){
		processList[script].kill('SIGKILL')
	}

	debug(`spawn command: ${startProcess}`)
	processList[script] = spawn(
		startProcess,
		{
			cwd:cwd||__dirname,
			shell:true,
			detach:true,
			stdio:'ignore',
			env:{NODE_ENV:'development'}
		}
	)
}

module.exports = {
	singletonExec: config => call({...config}),
	build: config => call({script:'build', ...config}),
	deploy: config => call({script:'deploy', ...config}),
	buildDeploy: config => call({script:'build-deploy', ...config})
}