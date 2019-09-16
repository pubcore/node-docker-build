'use strict'
const updateMasterPackage = require('./updateMasterPackage'),
	{resolve} = require('path'),
	throat = require('throat')(4)

//update master branch of all own packages (masterPackages)
module.exports = ({masterPackages, workingDir}) => Promise.all(
	Object.keys(masterPackages).reduce((acc, scope) => {
		masterPackages[scope].packages.forEach(val => {
			var pckge = typeof val === 'string' ? {name:val} : val,
				{name, uri} = pckge
			acc.push( throat(() => updateMasterPackage({
				baseDir: resolve(workingDir, '_master-packages'),
				...masterPackages[scope], scope, name, uri
			})))
		})
		return acc
	}, [])
)
