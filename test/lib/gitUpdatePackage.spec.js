'use strict'
const updatePackage = require('../../js/lib/gitUpdatePackage'),
	rimraf = require('rimraf'),
	{doesNotReject, rejects, equal} = require('assert'),
	createTestRepo = require('./gitCreateTestRepo'),
	{join} = require('path'),
	updateTestRepo = require('./gitUpdateTestRepo')

var testRepoDir = join(__dirname, 'test-repos'),
	notExistingDir = join(testRepoDir, 'a-scope'),
	{uri, name, dir} = createTestRepo({files:[{name:'Readme.txt', content:' '}]}),
	packageDir = join(testRepoDir, name)

describe('update local of given remote git repository', () => {
	before(() => {
		rimraf.sync(notExistingDir)
	})
	after(() => {
		rimraf.sync(notExistingDir)
		rimraf.sync(dir)
		rimraf.sync(packageDir)
	})
	it('fails, if package dir is not empty and no .git dir exists', () =>
		rejects(updatePackage({dir: join(testRepoDir, 'noneEmpty'), uri}))
	)
	it('fails, if repo uri does not exists', ()=>{
		rejects(updatePackage({dir: join(testRepoDir, 'empty'), uri:'https://sxl'}))}
	)
	it('creates directories, if not exists and clone package', () =>
		doesNotReject(updatePackage({dir: packageDir, uri}))
	)
	//depends on previous test
	it('resolves to false, if nothing changed', () =>
		updatePackage({dir: packageDir, uri}).then(res => equal(res, false))
	)
	//depends on previous test
	it('resolves to hasChanged, if something changed', () =>
		Promise.resolve(updateTestRepo({files:[{name:'foo.txt', content:'bar'}], uri}))
			.then(() => updatePackage({dir: packageDir, uri}).then(res => equal(res, 'hasChanged')))
	)
})