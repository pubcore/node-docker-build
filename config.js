'use strict'
const path = require('path')
var {HOME, HOMEPATH, USERPROFILE} = process.env

module.exports = {
	baseDir: path.resolve(HOME || HOMEPATH || USERPROFILE, 'dev'),
	domain: 'local.dev',
	compositions:['todolist', 'calendar'],
	repository: {
		user:'git', domain:'github.com', scope:'pubcore', name:'test-domains'
	},
	masterPackages:{
		'pubcore':{
			user:'git',
			domain:'github.com',
			packages:['gitlab-event-receiver']
		}
	},
	target:{
		//if jump host is defined, key must point to key file on jump host
		host:{host:'connect.domain.com', key:'~/.ssh/id_rsa', user:'remote-user-name'},
		// optional:
		// jump:{host:'connect.dev.kdfse.com', key:'~/.ssh/id_rsa', user:'you'},
		stackName:'web'
	},
	configs:{
		'verdaccio-conf-v2':'verdaccio/conf/config.yaml'
	}
}