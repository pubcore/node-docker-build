'use strict'
const path = require('path'),
	cp = require('child_process')

//update packages which are not part of own scopes
module.exports = ({domain, compositions, masterPackages, baseDir, repository}) =>
	compositions.forEach(composition => {
		var {scope, name} = repository,
			compositionDir = path.resolve(baseDir, scope, name, domain, composition),
			nodeModulesDir = path.resolve(compositionDir, 'node_modules')

		Object.keys(masterPackages).forEach(scope => {
			cp.execSync(
				`rm -f ${path.resolve(nodeModulesDir, '@'+scope)}`
			)
			cp.execSync(
			   'npm i --progress=false --loglevel=error', {cwd:compositionDir}
			)
			cp.execSync(
				`ln -s ../../_dev/${scope} @${scope}`, {cwd:nodeModulesDir}
			)
		})
	})
