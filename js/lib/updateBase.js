'use strict'
const updatePackage = require('./gitUpdatePackage'),
	path = require('path')

module.exports = ({repository, baseDir}) => {
	var {user, domain, scope, name} = repository,
		dir = path.resolve(baseDir, scope, name)
	console.log(`BEGIN update of ${dir}`)
	return updatePackage({dir, uri:`${user}@${domain}:${scope}/${name}.git`})
}