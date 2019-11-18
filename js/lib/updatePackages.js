'use strict'
const {join} = require('path'),
	{spawn} = require('child_process')

//update packages which are not part of own scopes
module.exports = ({compositions, workingDir}) => Promise.all(
	compositions.reduce((acc, composition) => { acc.push( new Promise((res, rej) => {
		if(typeof composition === 'string'){
			//javascript package is assumed, use npm install
			var buildTarget = join(workingDir, '_build', composition),
				cp = spawn(`\
mkdir -p ${buildTarget} && \
 cp -rf ${composition}/  ${buildTarget}/ &&\
 cd ${buildTarget} &&\
 npm i --progress=false --loglevel=error`,
				{cwd:workingDir, stdio:'inherit', shell:true})
			cp.on('exit', code =>
				code != 0 ?
					rej(console.log(`ERROR uppdatePackages for composition "${composition}", exit with code ${code}`)) :
					res(console.log(`DONE updatePackages for composition "${composition}" in ${buildTarget}`)))
			cp.on('error', err => rej(err))
		}else{
			//external function is assumed (must return a promise), just execute it
			composition(workingDir).then(
				name => res(console.log(`DONE updatePackages for composition ${name}`)),
				err => rej(err)
			)
		}
	}))

	return acc
	}, [])
)
