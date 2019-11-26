'use strict'
const build = require('./lib/build'),
	loadConfig = require('./load-config'),
	process = require('process')

console.time('build')
console.log('BEGIN')
var [,,source, domain] = process.argv,
	childProcesses = [],
	killChilds = () => {
		(childProcesses||[]).forEach(cp => {
			try {
				if(cp!=='KILLED'){
					process.kill(-cp.pid)
					cp.kill('SIGINT')
				}
			} catch (e){/**/}
		})
		childProcesses[0] = 'KILLED'
	}

process.on('error', killChilds)
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