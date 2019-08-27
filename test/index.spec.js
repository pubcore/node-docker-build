const {expect} = require('chai'),
	{build, deploy, buildDeploy, singletonExec} = require('../js/index'),
	{execSync} = require('child_process'),
	script = 'testScript',
	script2 = 'test2Script'

describe('build and deployment automation', () => {
	it('exports build, deploy and buildDeploy functions', () => {
		expect(build).to.be.a('function')
		expect(deploy).to.be.a('function')
		expect(buildDeploy).to.be.a('function')
		build({cwd:__dirname, script:script2, logPath:'./'})
		deploy({cwd:__dirname, script:script2, logPath:'./'})
		buildDeploy({cwd:__dirname, script:script2, logPath:'./'})
	})
	it('ensures only one process is running for given script', () => {
		singletonExec({cwd:__dirname, script, logPath:'./'})
		singletonExec({cwd:__dirname, script, logPath:'./'})
		return new Promise(res => setTimeout(() => {
			res(execSync('pgrep -f "^[^ ]*node .+testScript.+"').toString().trim())
		}, 25)).then(res => expect(res).to.match(/^[0-9]+$/g))
	})
	it('supports "detach" boolean to enable synchronous build', () =>
		build({cwd:__dirname, script:script2, logPath:'./', detach:false})
	)
})
