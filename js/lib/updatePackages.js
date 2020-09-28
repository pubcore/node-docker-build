'use strict'
const {join} = require('path'),
	{spawn} = require('child_process')

//update packages which are not part of own scopes
module.exports = ({compositions, workingDir, update, parallelUpdates=2}, childProcesses, one) => {
	var throat = require('throat')(parallelUpdates)
	return Promise.all(
		compositions.reduce((acc, composition, index) => { acc.push(throat(() =>
			(childProcesses||[])[0] === 'KILLED' ?
				Promise.resolve(console.log(`INFO skip update of composition #${index} (reseived kill)`))
				: new Promise((res, rej) => {
					if(typeof composition === 'string'){
						if(one && one !== '_all_' && one !== composition){
							return res(console.log(`skipping ${composition}`))
						}
						console.log(`BEGIN updatePackages for composition "${composition}"`)
						//javascript package is assumed, use npm install
						var buildTarget = join(workingDir, '_build', composition),
							cp = spawn(`\
[ -d ${composition}/node_modules ] && echo "ERROR node_modules must NOT exists in ${workingDir}/${composition}" && exit 1 || \
 mkdir -p ${buildTarget} && \
 cp -rf ${composition}/ ${buildTarget}/ &&\
 cd ${buildTarget} &&\
 ${update ? 'npm update --progress=false --loglevel=error &&' : ''}\
 npm install --progress=false --loglevel=error --production`,
							{cwd:workingDir, stdio:'inherit', shell:true, detached: true}
							)
						childProcesses && childProcesses.push(cp)

						cp.on('exit', code =>
							code != 0 ?
								rej(console.log(`ERROR uppdatePackages for composition "${composition}", exit with code ${code}`)) :
								res(console.log(`DONE updatePackages for composition "${composition}" in ${buildTarget}`)))
						cp.on('error', err => rej(new Error(err)))
					}else{
					//external function is assumed (must return a promise), just execute it
						composition(workingDir, childProcesses, one).then(
							name => res(console.log(`DONE updatePackages for composition ${name}`)),
							err => rej(new Error(err))
						)
					}
				})))

		return acc
		}, [])
	)
}
