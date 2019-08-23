'use strict'
const {platform} = require('os'),
	quote = s => platform() === 'win32' ?
		s : `'${s.replace(/`/g, '').replace(/'/g, '\\\'')}'`

module.exports = args => Object.keys(args).reduce((acc, key) => {
	var arg = `${key}=${args[key]}`
	acc += ` --build-arg ${quote(arg)}`
	return acc
}, '')