const {spawn} = require('child_process'),
	flatten = file => file.replace(/[\\/]/g, '_'),
	path = require('path')

//map data to shell commands ..
const ssh = ({user, host, key}) =>
		`ssh ${key ? '-i ' + key : ''} ${user}@${host}`,
	remoteExec = ({host, jump, command}) =>
		`${jump ? ssh(jump) : ''}${ssh(host)} '${command}'`,
	uploadFile = ({file, host, jump}) => jump ?
		`cat ${file} | ${ssh(jump)} "cat | ${ssh(host)} 'cat > ${flatten(file)}'"`
		: `cat ${file} | ${ssh(host)} 'cat > ${flatten(file)}'`,
	deploy = ({host, jump, stackName}) =>
		remoteExec({host, jump, command:dockerStackDeploy({stackName})}),
	deployConfig = ({host, jump, name, file}) => remoteExec({
		host, jump, command:`docker config create ${name} ${flatten(file)}`
	}),
	composeFiles = '-c docker-compose.yml -c docker-compose-deploy.yml',
	dockerStackDeploy = ({stackName}) =>
		`docker stack deploy --prune --with-registry-auth ${composeFiles} ${stackName}`

module.exports = ({baseDir, target, configs, repository, domain}) => new Promise((res, rej) => {
	var {scope, name} = repository
	spawn(
		Object.keys(configs||{}).reduce((acc, name) =>
			acc += uploadFile({file:configs[name], ...target}) + ' && '
				+ deployConfig({...target, name, file:configs[name]}) + ' ; '
		, '') +
		uploadFile({file:'docker-compose.yml', ...target}) + ' && '
		+ uploadFile({file:'docker-compose-deploy.yml', ...target}) + ' && '
		+ deploy({...target, configs}),
		{cwd:path.resolve(baseDir, scope, name, domain), stdio:'inherit', shell:true}
	).on('exit', code => (code===0 ? res() : rej(console.log('ERROR deploy'))))
		.on('error', err => rej(err))
})