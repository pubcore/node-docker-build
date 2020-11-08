'use strict'
const {join} = require('path'),
	spawn = require('await-spawn'),
	pacote = require('pacote'),
	initTarget = require('./initTarget')

//update git-dependencies on master branch
module.exports = async ({workingDir, compositions}, one) => {
	for (var composition of compositions){
		if(
			typeof composition !== 'string'
			|| (one && one !== '_all_' && one !== composition)
		){
			continue
		}

		console.log(`Process git-dependencies for composition ${composition}`)
		var packagePath = await initTarget({composition, workingDir}),
			{dependencies} = require(join(packagePath, 'package.json'))

		try {
			var {dependencies:lockedDeps} = require(join(packagePath, 'package-lock.json'))
		} catch (e) {
			if(e instanceof Error && e.code === 'MODULE_NOT_FOUND'){
				lockedDeps = {}
			}else{ throw e }
		}

		var gitDependencies =
			Object.entries(dependencies).filter(([,version]) => version.match(/^git/))

		for(var [name, uri] of gitDependencies){
			var url = await pacote.resolve(`${uri.replace(/\.com:/, '.com/')}#master`),
				remoteSha = url.match(/[^#]+$/)[0]
			if(!lockedDeps[name] || !lockedDeps[name]['version'].includes(remoteSha)) {
				console.log(`install ${name}`)
				await spawn(
					`npm i --prefer-offline --production ${uri}`,
					{cwd:packagePath, stdio:'inherit', shell:true}
				)
			}
		}
	}
}
