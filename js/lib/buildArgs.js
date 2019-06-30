'use strict'
const quote = s => `"${s.replace(/`/g, '')}"`
module.exports = args => Object.keys(args).reduce((acc, key) => {
	var arg = `${key}=${args[key]}`
	acc += ` --build-arg ${quote(arg)}`
	return acc
}, '')