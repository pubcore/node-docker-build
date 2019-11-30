'use strict'
const {spawn} = require('child_process')

module.exports = uri => new Promise((res, rej) => {
	var command = `git ls-remote ${uri} master`,
		cp = spawn(command, [], {shell:true})
	cp.on('exit', code => code && rej(new Error(`exit code ${code} for command ${command}`)))
		.on('error', err => rej(err))
	cp.stdout.on('data', data => res(data.toString()))
})