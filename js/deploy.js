'use strict'
const deploy = require('./lib/deploy'),
	loadConfig = require('./load-config')

var [,,moduleName, domain] = process.argv
var config = loadConfig(moduleName, domain)
if(!config){
	process.exit()
}

console.time('deploy')
console.log('BEGIN')
deploy(config).then(() =>
	console.timeEnd('deploy'), err => console.log(err)
)