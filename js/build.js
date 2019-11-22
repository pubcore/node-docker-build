'use strict'
const build = require('./lib/build'),
	loadConfig = require('./load-config'),
	process = require('process')

console.time('build')
console.log('BEGIN')
var [,,source, domain] = process.argv,
	childProcesses = [],
	killChilds = () => (childProcesses||[]).forEach(cp => {
		try {
			process.kill(-cp.pid)
		} catch (e) {console.log(e.message)}
	})

process.on('error', killChilds)
process.on('exit', killChilds)
process.on('SIGINT', killChilds)

loadConfig(source, domain).then(config => {
	if(!config){
		process.exit()
	}
	build(config, childProcesses).then(
		() => console.timeEnd('build'),
		err => console.log('ERROR occured', err||'')
	)
})