'use strict'
const {join} = require('path'),
	{homedir, platform} = require('os'),
	masterPackages = require('../../js/master-packages.js'),
	readFile = file => platform() === 'win32' ?
		`"$((cat ${file}) -replace '\\"', '\\\\\\"' -join \\"\`n\\")"`
		: `"$(cat ${file})"`

module.exports = {
	sshHosts:'github.com',
	baseImage:'node:10.15.1-alpine',
	compositions:['js'],
	masterPackages,
	push:false,
	buildArgs:{
		SSH_PK: readFile(join(homedir(), '.ssh', 'id_rsa')),
		NPMRC: readFile(join(homedir(), '.npmrc')),
		STAMP: Date.now()
	}
}