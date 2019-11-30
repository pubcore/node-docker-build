'use strict'
const {join} = require('path'),
	throat = require('throat')(4),
	{promisify} = require('util'),
	fs = require('fs'),
	readFile = promisify(fs.readFile),
	writeFile = promisify(fs.writeFile),
	rimraf = require('rimraf'),
	gitGetLatest = require('./gitGetLatest'),
	updateMasters = async ({workingDir, composition}) => {
		var packageLockFile = join(workingDir, '_build', composition, 'package-lock.json')
		try {
			var packageLockJson = await readFile(packageLockFile, 'utf-8'),
				packageLock = JSON.parse(packageLockJson),
				changed = await Promise.all(Object.keys(packageLock.dependencies).reduce(
					(acc, packageName) => {
						var {version, from} = packageLock.dependencies[packageName]
						if(from && from.match(/^git.+\.git$/)){
							//this is a git dependency on master (because there is no ref info)
							var commitHash = version.match(/([^#]+)$/)[1],
								uri = from.match(/^[^.]+:\/\/(.+)/)[1]
							acc.push(throat(async () => {
								var latest = (await gitGetLatest(uri)).trim()
								if(latest.indexOf(commitHash) < 0){
									return {
										current: commitHash,
										latest: latest.match(/^([a-f0-9]+)/)[1],
										packageName
									}
								}
							}))
						}
						return acc
					}, []))

			var hasChanged, newPackageLockJson = changed.reduce((acc, change) => {
				if(change) {
					acc = acc.replace(change.current, change.latest)
					hasChanged = true
				}
				return acc
			}, packageLockJson)

			if(hasChanged){
				await writeFile(packageLockFile, newPackageLockJson, 'utf8')
				await Promise.all(changed.reduce((acc, change) => {
					if(change){
						var {packageName, current, latest} = change,
							stalePackage = join(workingDir, '_build', composition, 'node_modules', packageName)
						console.log(`INFO update ${packageName}: ${current.substring(0, 6)} => ${latest.substring(0, 6)}`)
						acc.push( throat( () => new Promise((res, rej) => rimraf(
							stalePackage,
							err => err ? rej(err) : res()
						))) )
					}
					return acc
				}, []))
			}
			return composition
		} catch (e) {
			return e.code === 'ENOENT' ?
				//file does not exist, assume needs to be build ...
				console.log(`INFO no package-lock found for composition "${composition}"`)
				: Promise.reject(e)
		}
	}

//update git-dependencies on master branch
module.exports = ({workingDir, compositions}, one) =>
	Promise.all(compositions.reduce((acc, composition) => {
		if(typeof composition === 'string' && (!one || one === '_all_' || one === composition)){
			console.log(`BEGIN check git-dependencies for composition ${composition}`)
			acc.push( updateMasters({workingDir, composition}) )
		}
		return acc
	}, []))
