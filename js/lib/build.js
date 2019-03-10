'use strict'
const updatePackages = require('./updatePackages'),
	updateMasterPackages = require('./updateMasterPackages'),
	updateBase = require('./updateBase'),
	dockerBuild = require('./dockerBuild')

module.exports = config =>
	updateBase(config).then(() =>
		Object.keys(config.masterPackages||{}).length
			&& updateMasterPackages(config), err => Promise.reject(err)).then(() =>
		updatePackages(config), err => Promise.reject(err)).then(() =>
		dockerBuild(config), err => Promise.reject(err))