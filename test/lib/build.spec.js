'use strict'
const build = require('../../js/lib/build'),
	createTestRepo = require('./gitCreateTestRepo'),
	{join} = require('path'),
	exampleScopeDir = join(__dirname, '..', '..', 'test-example-scopes', 'a-scope'),
	compositionsRepo = createTestRepo({files:join(exampleScopeDir, 'compositions')}),
	componentRepo = createTestRepo({files:join(exampleScopeDir, 'example-component')}),
	baseDir = join(__dirname, 'test-repos', 'a-scope'),
	domain = 'host.docker.internal',
	workingDir = join(baseDir, compositionsRepo.name, 'domains', domain),
	minConfig = {
		baseImage:'node:10.15.1-alpine',
		workingDir,
		buildDir:'_build',
		compositions:['js', () => Promise.resolve('php')],
		domain:'host.docker.internal',
		masterPackages:{'a-scope':{packages:[{uri:componentRepo.uri, name:componentRepo.name}]}},
	},
	{rejects} = require('assert'),
	rimraf = require('rimraf'),
	updateBase = require('../../js/lib/gitUpdatePackage')

describe('update/create packages then execute docker-compose build', () => {
	after(() => {
		rimraf.sync(compositionsRepo.dir)
		rimraf.sync(join(baseDir, 'a-scope'))
	})
	it('rejects if config is empty', () =>
		rejects(build({}))
	)
	it('resolves for example config', function(){
		this.timeout(15000)
		return updateBase(
			{dir:join(baseDir, compositionsRepo.name), uri:compositionsRepo.uri}
		).then(()=>build(minConfig))
	})
	it('rejects if errors occure in optional composition builder', function(){
		this.timeout(15000)
		return updateBase(
			{dir:join(baseDir, compositionsRepo.name), uri:compositionsRepo.uri}
		).then(() => rejects(
			build( {...minConfig, compositions:[() => Promise.reject()]} )
		))
	})
})