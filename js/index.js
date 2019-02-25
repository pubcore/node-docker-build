'use strict'
const {spawn} = require('child_process')

const call = ({script, moduleName, domain, logPath, cwd}) => spawn(
	`pgrep -f ".+${script} ${moduleName} ${domain}.+" | xargs kill ; \
		node ${script} ${moduleName} ${domain} > ${logPath||'../'}${script}.log 2>&1`,
	{cwd:cwd||__dirname, shell:true, detach:true, stdio:'ignore'}
).unref()

module.exports = {
	singletonExec: config => call({...config}),
	build: config => call({script:'build', ...config}),
	deploy: config => call({script:'deploy', ...config}),
	buildDeploy: config => call({script:'build-deploy', ...config})
}