'use strict'
const build = require('./lib/build'),
	loadConfig = require('./load-config'),
	process = require('process')

console.time('build')
console.log('BEGIN')
var [,,source, one, domain] = process.argv

;(async () => {
	var config = await loadConfig(source, domain)
	await build(config, one)
	console.timeEnd('build')
})()