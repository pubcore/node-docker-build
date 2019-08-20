'use strict'
const updatePackage = require('../../js/lib/gitUpdatePackage')
const rimraf = require('rimraf')
const {execSync} = require('child_process')
const {dirname} = require('path')
const tmpRepo = `${__dirname}/test-repos/remote.git`
const tmpWorkingTree = `${dirname(tmpRepo)}/remote`
const {mkdirSync, writeFileSync} = require('fs')
const uri = `file://${tmpRepo}`
const {doesNotReject, rejects} = require('assert')
const createTestRepo = () => {
	mkdirSync(tmpRepo, {recursive:true})
	execSync('git init --bare', {cwd:tmpRepo})
	execSync(`git clone ${uri}`, {cwd:dirname(tmpRepo)})
	writeFileSync(`${tmpWorkingTree}/readme.md`, ' ')
	execSync('git add . && git commit -m "init" && git push origin master', {cwd:tmpWorkingTree})
}

var notExistingDir = `${__dirname}/test-repos/test-scope`

before(() => {
	rimraf.sync(notExistingDir)
	createTestRepo()
})
after(() => {
	rimraf.sync(notExistingDir)
	rimraf.sync(tmpRepo)
	rimraf.sync(tmpWorkingTree)
})

describe('update given git repository', () => {
	it('fails, if package dir is not empty and no .git dir exists', () =>
		rejects(updatePackage({dir:`${__dirname}/test-repos/noneEmpty`, uri}))
	)

	it('creates directories, if not exists and clone package', () =>
		doesNotReject(updatePackage({dir: notExistingDir + '/remote', uri}))
	)

	it('it updates existing package via git pull', () =>
		doesNotReject(updatePackage({dir: notExistingDir + '/remote', uri}))
	)
})