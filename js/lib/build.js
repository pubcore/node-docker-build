'use strict'
const updatePackages = require('./updatePackages'),
	updateMasterPackages = require('./updateMasterPackages'),
	dockerBuild = require('./dockerBuild')

module.exports = async (config, one) => {
	await updateMasterPackages(config, one)
	await updatePackages(config, one)
	await dockerBuild(config, one)
}