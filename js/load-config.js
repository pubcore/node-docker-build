'use strict'

module.exports = (domainModule, domain) => {
	if(domainModule.match(/[^a-zA-Z0-9:_.@/\\-]/)){
		throw TypeError('illegal characters found in domain-module')
	}
	if(domain && domain.match(/[^a-z0-9_.-]/)){
		throw TypeError('illegal characters found in domain')
	}

	var config = require(domainModule)
	//TODO create schema and validate

	return domain ? config[domain] : config
}