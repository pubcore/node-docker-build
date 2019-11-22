'use strict'
const {promisify} = require('util'),
	{resolve, basename} = require('path'),
	{spawn} = require('child_process'),
	fs = require('fs'),
	mkdir = promisify(fs.mkdir)

module.exports = ({dir, uri, resetToMaster}) => new Promise((res, rej) => {
	var scopeDir = resolve(dir, '..'),
		create = () => {
			spawn(`git clone ${uri}`, {cwd:scopeDir, shell:true, stdout:'inherit'})
				.on('exit', code => code === 0 ? res('hasChanged') : rej(new Error(code)))
		},
		update = () => {
			var resetCommand = resetToMaster ? `git --git-dir=${dir}/.git reset --hard origin/master && ` : '',
				status = false,
				error = false,
				process = spawn(
					`${resetCommand} git --git-dir=${dir}/.git pull`,
					{cwd:dir, shell:true}
				)

			process.stdout.on('data', data => {
				var output = data.toString()
				console.log(`package "${basename(dir)}", git: ${output}`)
				if(output.match(/Fast-forward/gi)) status = 'hasChanged'
			})
			process.stderr.on('data', data => {
				var output = data.toString()
				//git creates output to stderr, despite of all is ok.
				//So only throw error for some cases
				if(output.match(/^fatal: /gi)) error = output
			})
			process.on('error', err => {
				err.code === 'ENOENT' ? create() : res(status)
			})
			//allways resolve this promise (ignored if there was a resolve before)
			process.on('exit', () => error ? rej(new Error(error)) : res(status))
		}

	mkdir(scopeDir, {recursive:true}).then(() => update(), err => rej(new Error(err)))
})