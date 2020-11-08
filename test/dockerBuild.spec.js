'use strict'
const dockerBuild = require('../js/lib/dockerBuild'),
	{rejects} = require('assert')

describe('docker-compose wrapper for build and push', () => {
	it('rejects, if working directory not exits', () => {
		rejects(dockerBuild({repository:{}, baseDir:'doesNotExists'}))
	})
})