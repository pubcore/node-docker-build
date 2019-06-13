'use strict'
const {resolve, basename} = require('path')

module.exports = (domainModule, domain) => {
	if(domainModule.match(/[^a-zA-Z0-9:_.@/\\-]/)){
		throw TypeError('illegal characters found in domain-module')
	}
	if(domain && domain.match(/[^a-z0-9_.-]/)){
		throw TypeError('illegal characters found in domain')
	}

	var config = require(domainModule)
	//TODO create schema and validate

	if(config){
		//determine base directory of local (cloned) packages
		config.baseDir = resolve(domainModule, '../../../')
		//convention: dir-name equals domain-name e.g. example.com
		config.domain = basename(resolve(domainModule, '../'))
	}

	return (domain ? config[domain] : config)
}