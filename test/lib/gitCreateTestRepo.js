'use strict'
const {execSync} = require('child_process'),
	{writeFileSync, mkdtempSync, renameSync} = require('fs'),
	{sep, join, basename} = require('path'),
	{tmpdir} = require('os'),
	rimraf = require('rimraf'),
	tmp = `${tmpdir()}${sep}`,
	{copySync} = require('fs-extra')

module.exports = ({files}) => {
	var tmpDir = mkdtempSync(tmp),
		dir = `${tmpDir}.git`,
		tmpDir2 = mkdtempSync(tmp),
		uri = `file://${dir}`,
		name = basename(tmpDir),
		workingTree = join(tmpDir2, name)

	renameSync(tmpDir, dir)
	execSync('git init --bare', {cwd:dir})
	execSync(`git clone ${uri}`, {cwd:tmpDir2})
	if(typeof files === 'string'){
		copySync(files, workingTree)
	}else{
		files.forEach(({name, content}) => {
			writeFileSync(join(workingTree, name), content)
		})
	}
	execSync(
		'git add . && git commit -m "init" && git push origin master',
		{cwd:workingTree}
	)
	rimraf.sync(tmpDir2)
	return {uri, dir, name}
}