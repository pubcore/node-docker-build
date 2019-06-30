'use strict'
const {resolve, basename, dirname} = require('path'),
	findPackageJson = require('find-package-json')

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
		var packageFile = findPackageJson(domainModule).next().filename
		//convention: dir-name equals domain-name e.g. example.com
		config.domain = basename(resolve(domainModule, '../'))
		//determine base directory of local (cloned) packages
		config.baseDir = resolve(packageFile, '../../../')
		if(config.repository || (config.repository = {})){
			config.repository.domainDir =
				resolve(domainModule, '../../').replace(dirname(packageFile), '').replace(/^\//, '')
		}
		if(config.push === undefined){
			config.push = true
		}
	}

	return (domain ? config[domain] : config)
}