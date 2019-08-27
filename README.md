## functions to build and deploy to a docker swarm, based on configuration

#### Prerequisites
* latest docker installed (deamon is running and docker-compose does work)
* latest nodejs/npm installed
* git client installed
* ssh access (optional over jump host) to deployment target, docker manager host

#### Configuration example: domain-config module (config.js)
```
'use strict'

module.exports = {
	compositions:['test'], //compostions of subdomains e.g. test.example.com
	repository: {  //this repository contains the "domain" folder
		user:'git', domain:'github.com', scope:'your-scope', name:'compositions'
	},
	masterPackages:{ //optional, used for development systems
		'your-scope':{
			user:'git',
			domain:'github.com',
			packages:['some-package', 'some-other-package']
		}
	},
	target:{
		host:{host:'manager.example.com', key:'/home/admin/.ssh/id_rsa', user:'admin'},
		jump:{host:'connect.example.com', key:'~/.ssh/id_rsa', user:'admin'},
		home:'/home/admin',
		stackName: 'example',
		sudo:false //optional, prepend "sudo", if required for docker commands
	},
	configs:{ //optional, will be transfered to create docker config
		'verdaccio-conf-v2':'verdaccio/conf/config.yaml'
	},
	detach: true //optional, if false std-out/-err is piped to current shell,
	push: true //ptional, if false no docker-compose push will be executed
}
```

#### Tested features

	build and deployment automation
	  ✓ exports build, deploy and buildDeploy functions
	  ✓ ensures only one process is running for given script

	domain-config module loader
	  ✓ loads config module and returns config of given domain
	  ✓ validates config module string (path to config.js package)
		✓ sets "domain" based on convention ()
		✓ sets "baseDir" based on convention
