'use strict'
const {join} = require('path'),
	{homedir, platform} = require('os'),
	masterPackages = require('../../js/master-packages.js'),
	readFile = file => platform() === 'win32' ?
		`"$((cat ${file}) -replace '\\"', '\\\\\\"' -join \\"\`n\\")"`
		: `"$(cat ${file})"`

module.exports = {
	compositions:['js'],
	repository: {
		user:'git', domain:'github.com', scope:'a-scope', name:'compositions'
	},
	masterPackages,
	push:false,
	buildArgs:{
		SSH_PK: readFile(join(homedir(), '.ssh', 'id_rsa')),
		NPMRC: readFile(join(homedir(), '.npmrc')),
		STAMP: Date.now()
	}
}