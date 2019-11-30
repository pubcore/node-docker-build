'use strict'
const updateMasters = require('../../js/lib/updateMasterPackages'),
	{join} = require('path'),
	{doesNotReject, ok, rejects} = require('assert'),
	workingDir = join(__dirname, 'test-updateMasterPackages'),
	{copySync, removeSync, pathExistsSync} = require('fs-extra'),
	jsDir = join(workingDir, '_build', 'js')

before(() => {
	copySync(join(jsDir, '_node_modules'), join(jsDir, 'node_modules'))
	copySync(join(jsDir, '_package-lock.json'), join(jsDir, 'package-lock.json'))
})
after(() => {
	removeSync(join(jsDir, 'node_modules'))
	removeSync(join(jsDir, 'package-lock.json'))
})

describe('update git-dependencies, based on latest remote commit-hash', () => {
	it('does nothing, if there is no package-lock.json', () =>
		doesNotReject(
			updateMasters({
				workingDir:join(__dirname, 'test-updateMasterPackages'),
				compositions:['js']
			}, 'js')
		)
	)
	it('updates master git-dependencies in package-lock.json and deletes correspondin package in node_modules, if changed', async () => {
		await doesNotReject(
			updateMasters({
				workingDir, compositions:['js']
			}, '_all_')
		)
		ok(!pathExistsSync(join(jsDir, 'node_modules', '@pubcore', 'docs', 'dummy.txt')))
	}).timeout(10000)
	it('will reject on errors', () =>
		rejects(
			updateMasters({workingDir, compositions:['garbled']})
		)
	).timeout(10000)
})