'use strict'
const updatePackages = require('./updatePackages'),
	updateMasterPackages = require('./updateMasterPackages'),
	dockerBuild = require('./dockerBuild')

var childProcesses = [],
	killChilds = () => {
		(childProcesses||[]).forEach(cp => {
			try {
				if(cp!=='KILLED'){
					process.kill(-cp.pid)
					cp.kill('SIGINT')
				}
			} catch (e){/**/}
		})
		childProcesses[0] = 'KILLED'
	}

process.on('error', killChilds)
process.on('SIGINT', killChilds)

module.exports = async (config, one) => {
	Object.keys(config.masterPackages||{}).length &&
		await updateMasterPackages(config)
	await updatePackages(config, childProcesses, one)
	await dockerBuild(config, one)
}
