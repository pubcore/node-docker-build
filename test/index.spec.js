const {expect} = require('chai'),
	{build, deploy, buildDeploy} = require('../js/index'),
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
	it('supports "detach" boolean to enable synchronous build', () =>
		build({cwd:__dirname, script:script2, logPath:'./', detach:false})
	)
})
