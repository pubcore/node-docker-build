const {spawn} = require('child_process'),
	flatten = file => file.replace(/[\\/]/g, '_'),
	path = require('path')

//map data to shell commands ..
const ssh = ({user, host, key}) =>
		`ssh ${key ? '-i ' + key : ''} -oStrictHostKeyChecking=accept-new ${user}@${host}`,
	remoteExec = ({host, jump, command, sudo}) =>
		`${jump ? ssh(jump) + ' ' : ''}${ssh(host)} '${sudo?'sudo':''} ${command}'`,
	uploadFile = ({file, host, jump}) => jump ?
		`cat ${file} | ${ssh(jump)} "cat | ${ssh(host)} 'cat > /tmp/${flatten(file)}'"`
		: `cat ${file} | ${ssh(host)} 'cat > /tmp/${flatten(file)}'`,
	deploy = ({host, jump, stackName, sudo}) =>
		remoteExec({host, jump, sudo, command:dockerStackDeploy({stackName})}),
	deployConfig = ({name, file, ...rest}) => remoteExec({
		...rest, command:`docker config create ${name} /tmp/${flatten(file)}`
	}),
	composeFiles = '-c /tmp/docker-compose.yml -c /tmp/docker-compose-deploy.yml',
	dockerStackDeploy = ({stackName}) =>
		`docker stack deploy --prune --with-registry-auth ${composeFiles} ${stackName}`

module.exports = ({baseDir, target, configs, repository, domain}) => new Promise((res, rej) => {
	var {scope, name, domainDir} = repository,
		command = Object.keys(configs||{}).reduce((acc, name) =>
			acc += uploadFile({file:configs[name], ...target}) + ' && '
				+ deployConfig({...target, name, file:configs[name]}) + ' ; '
		, '') + uploadFile({file:'docker-compose.yml', ...target}) + ' && '
		+ uploadFile({file:'docker-compose-deploy.yml', ...target}) + ' && '
		+ deploy({...target, configs}),
		cwd = path.resolve(baseDir, scope, name, domainDir||'', domain)
	console.log('working dir: ' + cwd)
	console.log(command)
	spawn( command, {cwd, stdio:'inherit', shell:true})
		.on('exit', code => (code===0 ? res() : rej(console.log('ERROR deploy'))))
		.on('error', err => rej(err))
})