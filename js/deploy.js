'use strict'
const deploy = require('./lib/deploy'),
	loadConfig = require('./load-config')

var [,,source, filter, domain] = process.argv
loadConfig(source, domain).then(config => {
	if(!config){
		process.exit()
	}

	console.time('deploy')
	console.log('BEGIN')
	deploy(config).then(() =>
		console.timeEnd('deploy'), err => console.log(err)
	)
})
