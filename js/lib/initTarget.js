'use strict'
const spawn = require('await-spawn'),
	{join} = require('path')

module.exports = async ({composition, workingDir}) => {
	var buildTarget = join(workingDir, '_build', composition)

	await spawn(`\
[ -d ${composition}/node_modules ] && echo "ERROR node_modules must NOT exists in ${workingDir}/${composition}" && exit 1 || \
mkdir -p ${buildTarget} && \
cp -rf ${composition}/\* ${buildTarget}/`,
	{cwd:workingDir, shell:true, stdio:'inherit'}
	)

	return buildTarget
}
