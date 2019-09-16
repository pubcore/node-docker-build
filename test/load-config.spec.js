'use strict'
const loader = require('../js/load-config'),
	{deepEqual, ok, equal} = require('assert'),
	{existsSync} = require('fs'),
	{join} = require('path'),
	config = join(__dirname + '/config.js')

describe('domain-config module loader', () => {
	it('returns module, if domain is not given', () =>
		loader(config).then(res => deepEqual(res['test.com'], {}))
	)
	it('sets "domain" based on convention', () =>
		loader(config).then(res => deepEqual(res.domain, 'test'))
	)
	it('sets "workingDir" based on convention', () =>
		loader(config).then(res => ok(existsSync(res.workingDir)))
	)
	it('sets "push" to true as default', () =>
		loader(config).then(res => equal(res.push, true))
	)
})