import * as core from '@actions/core';
import { getOctokit } from '@actions/github';
import { getDownloadReleases } from './release';

type Options = {
  log?: Console
}

async function run(): Promise<void> {
  try {
    // Create octokit client
    const token = core.getInput('github-token', { required: true });
    const debug = core.getInput('debug')
    const opts: Options = {}
    if (debug === 'true') {
      opts.log = console;
    }
    const github = getOctokit(token, opts);
    // Get download releases
    const downloadReleases = getDownloadReleases(github.paginate);
    console.debug(downloadReleases);


    // const ms: string = core.getInput('milliseconds')
    // core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    // core.debug(new Date().toTimeString())
    // await wait(parseInt(ms, 10))
    // core.debug(new Date().toTimeString())

    // core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
