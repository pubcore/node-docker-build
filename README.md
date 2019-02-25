## functions to build and deploy docker images of pubcore compositions

#### Prerequisites
* latest docker installed (deamon is running)
* ssh access to remote manager hosts

#### Tested features

	build and deployment automation
	  ✓ exports build, deploy and buildDeploy functions
	  ✓ ensures only one process is running for given script

	domain-config module loader
	  ✓ loads config module and returns config of given domain
	  ✓ validates config module string
	  ✓ validates domain string
	  ✓ returns module, if domain is not given