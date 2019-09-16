'use strict'
const {resolve} = require('path'),
	{execSync} = require('child_process'),
	{platform} = require('os')

//update packages which are not part of own scopes
module.exports = ({compositions, masterPackages, workingDir}) => new Promise( res =>
	compositions.forEach(composition => {
		var compositionDir = resolve(workingDir, composition),
			nodeModulesDir = resolve(compositionDir, 'node_modules')
		console.log(`START install composition "${composition}" in ${compositionDir}`)
		if(Object.keys(masterPackages||{}).length){
			Object.keys(masterPackages).forEach(scope => {
				execSync(`rm -f ${resolve(nodeModulesDir, '@'+scope)}`)
				execSync('npm i --progress=false --loglevel=error', {cwd:compositionDir})
				platform() === 'win32' ?
					execSync(`mklink /D @${scope} ..\\..\\_master-packages\\${scope}`, {cwd:nodeModulesDir})
					: execSync(`ln -s ../../_master-packages/${scope} @${scope}`, {cwd:nodeModulesDir})
			})
		}else{
			execSync('npm i --progress=false --loglevel=error', {cwd:compositionDir})
		}
		res(console.log(`DONE install composition "${composition}" in ${compositionDir}`))
	}))
