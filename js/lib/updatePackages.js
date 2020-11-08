'use strict'
const spawn = require('await-spawn'),
	initTarget = require('./initTarget'),
	promiseRetry = require('promise-retry'),
	retryify = (retryOptions, f) =>
		promiseRetry(retryOptions, async (retry, number) => {try{
			await f()
		}catch(e){
			if(number <= retryOptions.retries){
				console.error(JSON.stringify(e))
				console.log(`Retry #${number} ...`)
			}
			retry(e)
		}})

module.exports = async ({
	compositions, workingDir, update, retryOptions={retries:1, minTimeout:30000}
}, one) => {
	for(var composition of compositions){
		if(typeof composition === 'string'){
			if(one && one !== '_all_' && one !== composition){
				console.log(`skipping ${composition}`)
				continue
			}
			console.log(`BEGIN: Update packages for composition "${composition}"`)
			//javascript package is assumed, use npm install
			var buildTarget = await initTarget({workingDir, composition})
			await retryify(retryOptions, () =>
				spawn(
					`${update ? 'npm update --loglevel=error && ' : ''}npm install --loglevel=error --production`,
					{cwd:buildTarget, stdio:'inherit', shell:true}
				)
			)
		}else{
			await retryify(retryOptions, async () => {
				//external function is assumed (must return a promise), just execute it
				composition = await composition(workingDir, [], one)
			})
		}
		console.log(`DONE: Update packages for composition ${composition}`)
	}
}
