'use strict'
const {resolve, basename, dirname} = require('path'),
	{homedir} = require('os'),
	updateBase = require('./lib/gitUpdatePackage'),
	parseGitUrl = require('git-url-parse')

module.exports = async (source, domain) => {
	var domainModule, baseDir
	if(domain){
		var {name} = parseGitUrl(source)
		baseDir = resolve(homedir(), 'build')
		await updateBase({uri:source, dir:resolve(baseDir, name)})
		domainModule = resolve(baseDir, name, 'domains', domain, 'config')
	}else{
		domainModule = source
		baseDir = basename(resolve(domainModule, '../../../../../'))
	}
	var config = require(domainModule)

	//TODO create schema and validate
	//convention: dir-name equals domain-name e.g. example.com
	config.domain = domain || basename(resolve(domainModule, '../'))
	//determine base directory of local (cloned) packages
	config.baseDir = baseDir
	config.workingDir = dirname(domainModule)
	if(config.push === undefined){
		config.push = true
	}
	if(!config.target){
		config.target = {home:homedir()}
	}

	return config
}