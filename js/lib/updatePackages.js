'use strict'
const {resolve} = require('path'),
	{execSync} = require('child_process')

//update packages which are not part of own scopes
module.exports = ({domain, compositions, masterPackages, baseDir, repository}) =>
	compositions.forEach(composition => {
		var {scope, name} = repository,
			compositionDir = resolve(baseDir, scope, name, domain, composition),
			nodeModulesDir = resolve(compositionDir, 'node_modules')
		console.log(`BEGIN installing composition ${composition} in ${compositionDir}`)
		Object.keys(masterPackages||{}).length ?
			execSync('npm i --progress=false --loglevel=error', {cwd:compositionDir})
			: Object.keys(masterPackages).forEach(scope => {
				execSync(`rm -f ${resolve(nodeModulesDir, '@'+scope)}`)
				execSync('npm i --progress=false --loglevel=error', {cwd:compositionDir})
				execSync(`ln -s ../../_dev/${scope} @${scope}`, {cwd:nodeModulesDir})
			})
	})
