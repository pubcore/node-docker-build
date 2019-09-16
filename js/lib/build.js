'use strict'
const updatePackages = require('./updatePackages'),
	updateMasterPackages = require('./updateMasterPackages'),
	dockerBuild = require('./dockerBuild')

module.exports = async config => {
	Object.keys(config.masterPackages||{}).length &&
		await updateMasterPackages(config)
	await updatePackages(config)
	await dockerBuild(config)
}
