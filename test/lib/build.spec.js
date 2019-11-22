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
		domain,
		masterPackages:{'a-scope':{packages:[{uri:componentRepo.uri, name:componentRepo.name}]}},
	},
	{rejects} = require('assert'),
	rimraf = require('rimraf'),
	updateBase = require('../../js/lib/gitUpdatePackage'),
	mkdir = require('util').promisify(require('fs').mkdir),
	{spawn} = require('child_process'),
	process = require('process')

describe('update/create packages then execute docker-compose build', () => {
	after(() => {
		rimraf.sync(compositionsRepo.dir)
		rimraf.sync(join(baseDir, 'a-scope'))
	})
	it('rejects if config is empty', () =>
		rejects(build({}))
	)
	it('resolves for example config', function(){
		this.timeout(60000)
		return updateBase(
			{dir:join(baseDir, compositionsRepo.name), uri:compositionsRepo.uri}
		).then(()=>build(minConfig))
	})
	it('rejects if errors occure in optional composition builder', function(){
		this.timeout(60000)
		return updateBase(
			{dir:join(baseDir, compositionsRepo.name), uri:compositionsRepo.uri}
		).then(() => rejects(
			build( {...minConfig, compositions:[() => Promise.reject()]} )
		))
	})
	it('rejects if a node_modules exists in source folder', function(){
		this.timeout(60000)
		return updateBase(
			{dir:join(baseDir, compositionsRepo.name), uri:compositionsRepo.uri}
		).then(() => mkdir(join(workingDir, 'js', 'node_modules'), {recursive:true})
			.then(() => rejects(build(minConfig)))
		)
	})
	it('kills spawned child process (required: detached=true)', function(){
		this.timeout(60000)
		var cpList = []
		return updateBase(
			{dir:join(baseDir, compositionsRepo.name), uri:compositionsRepo.uri}
		).then(() => mkdir(join(workingDir, 'js', 'node_modules'), {recursive:true})
			.then(() => rejects(build({
				...minConfig,
				compositions:[(wd, cpList) => {cpList.push(spawn('sleep 60', {detached:true, shell:true}))}, 'js']
			},
			cpList
			).then(
				()=>{throw 'reject is inspected'},
				() => Promise.reject(cpList.forEach(cp => process.kill(-cp.pid))))
			))
		)
	})
})