'use strict'
const build = require('../../js/lib/build'),
	createTestRepo = require('./gitCreateTestRepo'),
	{join} = require('path'),
	exampleScopeDir = join(__dirname, '..', '..', 'test-example-scopes', 'a-scope'),
	compositionsRepo = createTestRepo({files:join(exampleScopeDir, 'compositions')}),
	componentRepo = createTestRepo({files:join(exampleScopeDir, 'example-component')}),
	baseDir = join(__dirname, 'test-repos'),
	minConfig = {
		repository:{
			name:compositionsRepo.name,
			uri:compositionsRepo.uri,
			scope:'a-scope',
			domainDir:'domains'
		},
		baseDir,
		compositions:['js'],
		domain:'host.docker.internal',
		masterPackages:{'a-scope':{packages:[{uri:componentRepo.uri, name:componentRepo.name}]}}
	},
	{rejects} = require('assert'),
	rimraf = require('rimraf')

describe('update/create packages then execute docker-compose build', () => {
	after(() => {
		rimraf.sync(compositionsRepo.dir)
		rimraf.sync(join(baseDir, 'a-scope'))
	})
	it('rejects if config is empty', () =>
		rejects(build({}))
	)
	it('resolves for example config', function(){
		this.timeout(10000)
		return build(minConfig)
	})
})