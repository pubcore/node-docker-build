'use strict'
const {join} = require('path'),
	{spawn} = require('child_process')

//update packages which are not part of own scopes
module.exports = ({compositions, workingDir}, childProcesses) => Promise.all(
	compositions.reduce((acc, composition) => { acc.push( new Promise((res, rej) => {
		if(typeof composition === 'string'){

			//javascript package is assumed, use npm install
			var buildTarget = join(workingDir, '_build', composition),
				cp = spawn(`\
[ -d ${composition}/node_modules ] && echo "ERROR node_modules must NOT exists in ${workingDir}/${composition}" && exit 1 || \
 mkdir -p ${buildTarget} && \
 cp -rf ${composition}/ ${buildTarget}/ &&\
 cd ${buildTarget} &&\
 npm update --progress=false --loglevel=error`,
				{cwd:workingDir, stdio:'inherit', shell:true, detached: true}
				)
			childProcesses && childProcesses.push(cp)

			cp.on('exit', code =>
				code != 0 ?
					rej(console.log(`ERROR uppdatePackages for composition "${composition}", exit with code ${code}`)) :
					res(console.log(`DONE updatePackages for composition "${composition}" in ${buildTarget}`)))
			cp.on('error', err => rej(err))
		}else{
			//external function is assumed (must return a promise), just execute it
			composition(workingDir, childProcesses).then(
				name => res(console.log(`DONE updatePackages for composition ${name}`)),
				err => rej(err)
			)
		}
	}))

	return acc
	}, [])
)
