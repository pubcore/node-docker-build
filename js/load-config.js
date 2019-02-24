'use strict'
const {execSync} = require('child_process')

module.exports = argv => {
	var packageName = argv[2],
		domain = argv[3]
	if(!packageName){
		return console.log('domain package not set')
	}
	if(packageName.match(/[^a-z@\-\/]/)){
		return console.log('illegal characters found in "packageName"')
	}
	try {
		execSync(`npm list --depth=0 ${packageName}`)
	} catch (e) {
		return console.log('domain packageName not found/installed')
	}
	
	if(domain && domain.match(/[^a-z0-9_\-\/.]/)){
		return console.log('illegal characters found in "domain"')
	}

	var config = require(packageName)
	//TODO create schema and validate

	return domain ? config[domain] : config
}