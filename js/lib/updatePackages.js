'use strict'
const {resolve} = require('path'),
	{execSync} = require('child_process'),
	{platform} = require('os')

//update packages which are not part of own scopes
module.exports = ({domain, compositions, masterPackages, baseDir, repository}) =>
	compositions.forEach(composition => {
		var {scope, name, domainDir} = repository,
			compositionDir = resolve(baseDir, scope, name, domainDir||'', domain, composition),
			nodeModulesDir = resolve(compositionDir, 'node_modules')

		if(Object.keys(masterPackages||{}).length){
			Object.keys(masterPackages).forEach(scope => {
				execSync(`rm -f ${resolve(nodeModulesDir, '@'+scope)}`)
				execSync('npm i --progress=false --loglevel=error', {cwd:compositionDir})
				platform() === 'win32' ?
					execSync(`mklink /D @${scope} ..\\..\\_dev\\${scope}`, {cwd:nodeModulesDir})
					: execSync(`ln -s ../../_dev/${scope} @${scope}`, {cwd:nodeModulesDir})
			})
		}else{
			execSync('npm i --progress=false --loglevel=error', {cwd:compositionDir})
		}
		console.log(`DONE install composition "${composition}" in ${compositionDir}`)
	})
