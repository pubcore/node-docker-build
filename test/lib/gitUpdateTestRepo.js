'use strict'
const {mkdtempSync, writeFileSync} = require('fs'),
	{tmpdir} = require('os'),
	{sep, join, basename} = require('path'),
	{execSync} = require('child_process')

module.exports = ({uri, files}) => {
	var tmpDir = mkdtempSync(`${tmpdir()}${sep}`),
		workingTree = join(tmpDir, basename(uri).replace(/.git$/, ''))

	execSync(`git clone ${uri}`, {cwd:tmpDir})
	files.forEach(({name, content}) => {
		writeFileSync(join(workingTree, name), content)
	})
	execSync(
		'git add . && git commit -m "update" && git push origin master',
		{cwd:workingTree}
	)
}