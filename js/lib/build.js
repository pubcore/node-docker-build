'use strict'
const updatePackages = require('./updatePackages'),
	updateMasterPackages = require('./updateMasterPackages'),
	updateBase = require('./updateBase'),
	dockerBuild = require('./dockerBuild')

module.exports = async config => {
	await updateBase(config)
	Object.keys(config.masterPackages||{}).length &&
		await updateMasterPackages(config)
	await updatePackages(config)
	await dockerBuild(config)
}
