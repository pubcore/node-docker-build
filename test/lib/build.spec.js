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
		compositions:['js', () => Promise.resolve('php'), 'xyz'],
		domain,
		masterPackages:{'a-scope':{packages:[{uri:componentRepo.uri, name:componentRepo.name}]}},
		buildKit:true
	},
	{rejects, doesNotReject} = require('assert'),
	rimraf = require('rimraf'),
	updateBase = require('../../js/lib/gitUpdatePackage'),
	mkdir = require('util').promisify(require('fs').mkdir),
	{spawn} = require('child_process')

describe('update/create packages then execute docker-compose build', () => {
	beforeEach(() => updateBase(
		{dir:join(baseDir, compositionsRepo.name), uri:compositionsRepo.uri}
	))
	afterEach(() => rimraf.sync(join(baseDir, 'a-scope')))
	after(() => rimraf.sync(compositionsRepo.dir))

	it('rejects if config is empty', () =>
		rejects(build({}))
	)
	it('resolves for example config', () =>
		doesNotReject(build(minConfig, 'js'))
	).timeout(60000)
	it('resolves for disabled buildKit', () =>
		doesNotReject(build({...minConfig, buildKit:false}, 'js'))
	).timeout(60000)
	it('resolves with update', () =>
		doesNotReject(build({...minConfig, update:true}, 'js'))
	).timeout(60000)
	it('rejects if errors occure in optional composition builder', () =>
		rejects(
			build( {...minConfig, compositions:[() => Promise.reject()]}, [])
		)
	).timeout(60000)
	it('rejects if a node_modules exists in source folder', () =>
		mkdir(join(workingDir, 'js', 'node_modules'), {recursive:true})
			.then(() => rejects(build(minConfig)))
	).timeout(60000)
	it('kills spawned child process (required: detached=true)', () =>
		mkdir(join(workingDir, 'js', 'node_modules'), {recursive:true})
			.then(() => rejects(build({
				...minConfig,
				compositions:[
					(wd, cpList) => {cpList.push(spawn('sleep 10', {detached:true, shell:true}))},
					'js'
				]
			})))
	).timeout(60000)
})