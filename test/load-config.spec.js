'use strict'
const loader = require('../js/load-config'),
	{deepEqual, throws, ok, equal} = require('assert'),
	{existsSync} = require('fs'),
	{join} = require('path'),
	config = join(__dirname + '/config.js')

describe('domain-config module loader', () => {
	it('loads config module and returns config of given domain', () => {
		deepEqual(loader('../test/config.js', 'test.com'), {})
	})
	it('validates config module string', () => {
		throws(() => loader('no white space'), TypeError)
	})
	it('validates domain string', () => {
		throws(() => loader('foo', 'no white space'), TypeError)
	})
	it('returns module, if domain is not given', () => {
		deepEqual(loader(config)['test.com'], {})
	})
	it('sets "domain" based on convention', () => {
		deepEqual(loader(config).domain, 'test')
	})
	it('sets "basePath" based on convention', () => {
		ok(existsSync(loader(config).baseDir))
	})
	it('sets "repository.domainDir" based on location of domain folders', () => {
		equal(loader(config).repository.domainDir, '')
	})
	it('sets "push" to true as default', () => {
		equal(loader(config).push, true)
	})
})