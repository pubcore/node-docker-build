'use strict'
const {promisify} = require('util'),
	path = require('path'),
	{spawn} = require('child_process'),
	fs = require('fs'),
	mkdir = promisify(fs.mkdir)

module.exports = ({dir, uri}) => new Promise((res, rej) => {
	var scopeDir = path.resolve(dir, '..'),
		create = () => {
			spawn('git', ['clone', uri], {cwd:scopeDir})
				.on('exit', val => val === 0 ? res('hasChanged') : rej(new Error(val)))
		},
		update = () => {
			var process = spawn('git', [`--git-dir=${dir}/.git`, 'pull'], {cwd:dir})
			process.stdout.on('data', data => {
				var output = data.toString()
				if(output.match(/up to date/gi)) res(false)
				res('hasChanged')
			})
			process.stderr.on('data', data => {
				var output = data.toString()
				//git creates output to stderr, despite of all is ok.
				//So only throw error for some cases
				if(output.match(/^fatal: /)) rej(new Error(output))
			})
			process.on('error', err => {
				err.code === 'ENOENT' && create()
			})
			//allways resolve this promise (ignored if there was a resolve before)
			process.on('exit', code => res(code))
		}

	mkdir(scopeDir, {recursive:true}).then(() => update(), err => rej(new Error(err)))
})