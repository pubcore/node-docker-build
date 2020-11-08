'use strict'
const deploy = require('./lib/deploy'),
	loadConfig = require('./load-config')

var [,,source,, domain] = process.argv
;(async () => {
	var config = await loadConfig(source, domain)
	if(!config){
		process.exit()
	}
	console.time('deploy')
	console.log('BEGIN')
	await deploy(config)
	console.timeEnd('deploy')
})()