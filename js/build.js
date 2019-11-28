'use strict'
const build = require('./lib/build'),
	loadConfig = require('./load-config'),
	process = require('process')

console.time('build')
console.log('BEGIN')
var [,,source, one, domain] = process.argv

loadConfig(source, domain).then(config => {
	if(!config){
		process.exit()
	}
	build(config, one).then(
		() => console.timeEnd('build'),
		err => console.log('ERROR occured', err||'')
	)
})