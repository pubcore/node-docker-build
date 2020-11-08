'use strict'
const updateMasters = require('../js/lib/updateMasterPackages'),
	{join} = require('path'),
	{ok} = require('assert'),
	workingDir = join(__dirname, 'test-updateMasterPackages'),
	jsDir = join(workingDir, '_build', 'js'),
	rimraf = require('rimraf'),
	cleanup = () => {
		rimraf.sync(join(workingDir, '_build'))
	}

describe('maintain git-dependencies, based on latest remote commit-hash', () => {
	after(cleanup)
	it('installs new packages', async () => {
		await updateMasters({workingDir, compositions:['js']}, '_all_')
		ok(require(join(jsDir, 'package-lock.json')).dependencies)
	}).timeout(60000)
	it('ignores none js compositions', async() => {
		await updateMasters({workingDir, compositions:[null]}, '_all_')
	})
	it('does not install unchanged package', async () => {
		await updateMasters({workingDir, compositions:['js']}, '_all_')
		ok(require(join(jsDir, 'package-lock.json')).dependencies)
	})
})