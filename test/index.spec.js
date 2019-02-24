const {expect} = require('chai'),
	{build, deploy, buildDeploy} = require('../js/index')

describe('build and deployment automation', () => {
	it('exports build, deploy and buildDeploy functions', () => {
		expect(build).to.be.a('function')
		expect(deploy).to.be.a('function')
		expect(buildDeploy).to.be.a('function')
	})
})
