'use strict'
const updatePackages = require('./updatePackages'),
	updateMasterPackages = require('./updateMasterPackages'),
	updateBase = require('./updateBase'),
	path = require('path'),
	cp = require('child_process'),
	compose = (command, path) => process.env.DOCKER_HOST ?
		`docker run --rm -v /var/run/:/var/run -v domains:/wd -i -a STDOUT -a STDERR -w /wd/${path} docker/compose:1.23.2 ${command}`
		: `docker-compose ${command}`

module.exports = config =>
	updateBase(config).then(() =>
		Object.keys(config.masterPackages||{}).length
			&& updateMasterPackages(config), err => Promise.reject(err)).then(() =>
		updatePackages(config), err => Promise.reject(err)).then(() => {
		var {scope, name} = config.repository,
			subPath = `${scope}/${name}/${config.domain}`,
			dir = path.resolve(config.baseDir, subPath)

		return cp.execSync(
			`${compose('build', subPath)} && ${compose('push', subPath)}`,
			{cwd:dir, stdio:'inherit'}
		)
	}, err => Promise.reject(err))