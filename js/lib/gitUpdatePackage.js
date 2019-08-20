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
				.on('error', err => rej(err))
				.on('exit', code => (code === 0 ? res('hasChanged') : rej({code})))
		},
		update = () => {
			var cp = spawn('git', [`--git-dir=${dir}/.git`, 'pull'], {cwd:dir})
			cp.stdout.on('data', data => {
				var output = data.toString()
				output.match(/up to date/) ?
					res(false)
					: ( output.match(/error: /gi) ? rej(output) : res('hasChanged') )
			})
			cp.stderr.on('data', () => create())
			cp.on('error', err => err.code === 'ENOENT' ? create() : rej(err))
		}
	mkdir(scopeDir, {recursive:true}).then(() => update(), err => rej(err))
})