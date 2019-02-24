'use strict'
const {spawn} = require('child_process')

const call = (script, pkgName, domain) => spawn(
	`kill "$(pgrep -f 'node ${script} ${pkgName} ${domain}')" ; node ${script} ${pkgName} ${domain} >  ../${script}.log 2>&1`,
	{cwd:__dirname, detach:true, stdio:'ignore', shell:true}
).unref()

module.exports = {
	build: (pkgName, domain) => call('build', pkgName, domain),
	deploy: (pkgName, domain) => call('deploy', pkgName, domain),
	buildDeploy: (pkgName, domain) => call('build-deploy', pkgName, domain)
}