'use strict'
const {spawn} = require('child_process'),
	path = require('path'),
	updateMaster = require('./gitUpdatePackage')

module.exports = ({baseDir, user, domain, scope, name, uri}) =>
	new Promise((res, rej) => {
		var dir = path.resolve(baseDir, scope, name),
			packageName = `${scope}/${name}`,
			npmInstall = () => {
				spawn(
					`npm install --progress=false --loglevel=error && \\
						npm prune --production --progress=false`,
					{cwd:dir, stdio:'inherit', shell:true}
				).on('exit', code => code === 0 ?
					res(console.log(`DONE install of ${packageName}`))
					: rej(new Error({code}))
				).on('error', err => rej(new Error(err)))
			}

		updateMaster({
			dir,
			uri:uri||`${user}@${domain}:${scope}/${name}.git`,
			resetToMaster: true
		}).then(
			result => result === 'hasChanged' ?
				npmInstall()
				: res(console.log(`DONE update, ${packageName} is up-to-date`)),
			err => rej(new Error(err))
		)
	})