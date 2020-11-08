'use strict'
const buildArg = require('../js/lib/buildArgs'),
	{equal} = require('assert')
describe('build arguments', () => {
	it('transforms object to arguments string', () =>{
		equal(
			buildArg({KEY: '\'foobar`', TEST:'f b'}),
			' --build-arg KEY=\\\'foobar --build-arg TEST=f b'
		)
	})
})