import * as core from '@actions/core'
import {getOctokit} from '@actions/github'
import {listReleases, updateRelease} from './release'

interface OctokitOptions {
  log?: {
    debug: (message: string) => unknown
    info: (message: string) => unknown
    warn: (message: string) => unknown
    error: (message: string) => unknown
  }
}

async function run(): Promise<void> {
  try {
    // Create octokit client
    const token = core.getInput('github-token', {required: true})
    const debug = core.getInput('debug')
    const opts = {} as OctokitOptions
    if (debug === 'true') {
      opts.log = console
    }
    const github = getOctokit(token, opts)
    // Try to update all releases
    const releases = await listReleases(github)
    if (releases.length === 0) {
      core.info('ℹ️ No release found')
    } else {
      core.info(`ℹ️ ${releases.length} release found.`)
    }
    const updatedReleases = []
    for (const release of releases) {
      if (release.needUpdate()) {
        core.info(
          `ℹ️ Release ${release.tagName()} needs an update (${release.currentVersion?.toString()} => ${release.latestVersion?.toString()}).`
        )
        await updateRelease(github, release)
        core.info(`✅ Release ${release.tagName()} was successfully updated.`)
        updatedReleases.push(release)
      } else {
        core.info(`✅ Release ${release.tagName()} is up-to-date.`)
      }
    }
    core.setOutput('updated-releases', updatedReleases)
  } catch (error) {
    if (error instanceof Error) core.setFailed(`❌ ${error.message}`)
  }
}

run()
