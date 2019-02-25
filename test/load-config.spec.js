'use strict'
const loader = require('../js/load-config'),
	{deepEqual, throws} = require('assert')

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
		deepEqual(loader('../test/config.js'), {'test.com': {}})
	})
})