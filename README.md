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
	baseImage:'node:10.15.1-alpine'
	compositions:['test'], //compostions of subdomains e.g. test.example.com
	target:{ //optional, target system (deploy)
		host:{host:'manager.example.com', key:'/home/admin/.ssh/id_rsa', user:'admin'},
		jump:{host:'connect.example.com', key:'~/.ssh/id_rsa', user:'admin'},
		home:'/home/admin',
		stackName: 'example',
		sudo:false //optional, prepend "sudo", if required for docker commands
	},
	configs:{ //optional, will be transfered to create docker config (deploy)
		'verdaccio-conf-v2':'verdaccio/conf/config.yaml'
	},
	detach: true //optional, if false std-out/-err is piped to current shell,
	push: true //optional, if false no docker-compose push will be executed,
	update: false //optional, if true "npm update" is used, else "npm install",
	forcePull: false //optional, if true --pull flag is set for docker build,
	buildKit: false //optional, if true docker build kit is enabled for build,
	retryOptions: {retries:1, minTimeout:30000} //retry options for updatePackages
}
```

#### Examples
1) In context of an CI/CD server:
Build, push and deploy some images on a dev system composition (dev.example.com)
Execution is done in background (spawn a script).
If there is already running one, it will be killed.
Output is piped to file within defined "logPath".
```
import {buildDeploy} from '@pubcore/node-docker-build'

buildDeploy({
	repo:'git@github.com:your-scope/compositions.git',
	domain:'dev.example.com',
	logPath:'~/'
})
```

In context of local compositions package, on developers machine:
Build and push some images of a domain.
Execution runns in foreground (detach=false), stdout to console
```
const {build} = require('@pubcore/node-docker-build')
build({
	configModule: resolve(__dirname, 'domains', 'host.docker.internal' , 'config'),
	detach: false,
})
```
