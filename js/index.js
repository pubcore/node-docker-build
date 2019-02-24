'use strict'
const {spawn} = require('child_process')

const call = script => spawn(
	`kill "$(pgrep -f 'node ${script}')" ; node  ${script} >  ../${script}.log 2>&1`,
	{cwd:__dirname, detach:true, stdio:'ignore', shell:true}
).unref()

module.exports = {
	build: () => call('build'),
	deploy: () => call('deploy'),
	buildDeploy: () => call('build-deploy')
}