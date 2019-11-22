'use strict'
const updatePackages = require('./updatePackages'),
	updateMasterPackages = require('./updateMasterPackages'),
	dockerBuild = require('./dockerBuild')

module.exports = async (config, childProcesses) => {
	Object.keys(config.masterPackages||{}).length &&
		await updateMasterPackages(config)
	await updatePackages(config, childProcesses)
	await dockerBuild(config)
}
