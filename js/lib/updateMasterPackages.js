'use strict'
const updateMasterPackage = require('./updateMasterPackage'),
	path = require('path'),
	throat = require('throat')(4)

//update master branch of all own packages (masterPackages)
module.exports = ({domain, masterPackages, baseDir, repository}) => Promise.all(
	Object.keys(masterPackages).reduce((acc, scope) => {
		masterPackages[scope].packages.forEach(name => {
			acc.push( throat(() => updateMasterPackage({
				baseDir: path.resolve(
					baseDir, repository.scope, repository.name, domain, '_dev'
				),
				...masterPackages[scope], scope, name
			})))
		})
		return acc
	}, [])
)
