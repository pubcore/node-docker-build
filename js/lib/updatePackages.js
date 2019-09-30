'use strict'
const {resolve} = require('path'),
	{execSync} = require('child_process')

//update packages which are not part of own scopes
module.exports = ({compositions, workingDir}) => new Promise( res =>
	compositions.forEach(composition => {
		var compositionDir = resolve(workingDir, composition)
		execSync('npm i --progress=false --loglevel=error', {cwd:compositionDir})
		res(console.log(`DONE install composition "${composition}" in ${compositionDir}`))
	})
)
