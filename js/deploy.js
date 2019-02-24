'use strict'
const deploy = require('./lib/deploy'),
	loadConfig = require('./load-config')

var config = loadConfig(process.argv)
if(!config){
	process.exit()
}

console.time('deploy')
console.log('BEGIN')
deploy(config).then(() =>
	console.timeEnd('deploy'), err => console.log(err)
)