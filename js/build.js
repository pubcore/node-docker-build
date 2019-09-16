'use strict'
const build = require('./lib/build'),
	loadConfig = require('./load-config')

console.time('build')
console.log('BEGIN')
var [,,source, domain] = process.argv
loadConfig(source, domain).then(config => {
	if(!config){
		process.exit()
	}
	build(config).then(() =>
		console.timeEnd('build'), err => console.log(err)
	)
})