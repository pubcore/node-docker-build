'use strict'
const cp = require('child_process')

module.exports = (command, wd) => new Promise((res, rej) =>{
	console.log(`${wd} ${command}`)
	cp.spawn( command, {cwd:wd, stdio:'inherit', shell:true} )
		.on('exit', code => code === 0 ? res() : rej(new Error({code})))
		.on('error', err => rej(new Error(err)))
})