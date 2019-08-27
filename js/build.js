'use strict'
const build = require('./lib/build'),
	loadConfig = require('./load-config')

console.time('build')
console.log('BEGIN')
var [,,moduleName, domain] = process.argv
var config = loadConfig(moduleName, domain)
if(!config){
	process.exit()
}
build(config).then(() =>
	console.timeEnd('build'), err => console.log(err)
)