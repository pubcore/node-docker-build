'use strict'
const {spawn} = require('child_process'),
	debug = require('debug')('node-docker-build')

const call = ({script, moduleName, domain, logPath, cwd}) => {
	var command =
	`pgrep -f ".+${script} ${moduleName} ${domain}.+" | xargs kill > ${logPath||'../'}_kill.log 2>&1 ; \
	node ${script} ${moduleName} ${domain} > ${logPath||'../'}_${script}.log 2>&1 &`
	debug(`spawn command: ${command}`)
	return spawn(
		command,
		{cwd:cwd||__dirname, shell:true, detach:true, stdio:'ignore'}
	).unref()
}

module.exports = {
	singletonExec: config => call({...config}),
	build: config => call({script:'build', ...config}),
	deploy: config => call({script:'deploy', ...config}),
	buildDeploy: config => call({script:'build-deploy', ...config})
}