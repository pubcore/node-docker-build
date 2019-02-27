'use strict'
const {promisify} = require('util'),
	path = require('path'),
	{spawn} = require('child_process'),
	fs = require('fs'),
	mkdir = promisify(fs.mkdir)

module.exports = ({dir, uri}) => new Promise((res, rej) => {
	var scopeDir = path.resolve(dir, '..')
	spawn('git', ['pull'], {cwd:dir})
		.on('error', err => err && err.code === 'ENOENT'
		&& mkdir(scopeDir, {recursive:true}).then(
			() => spawn('git', ['clone', uri], {cwd:scopeDir, stdio:'inherit'})
				.on('error', err => rej(console.log(err)))
				.on('exit', code => (code === 0 ? res('hasChanged') : rej())),
			err => rej(console.log(err))
		) || rej(err))
		.stdout.on('data', data =>
			data.toString().match(/up to date/) ?
				res(false)
				: res('hasChanged')
		)
})