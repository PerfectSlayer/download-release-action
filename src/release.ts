import {context} from '@actions/github'
import {PaginateInterface} from '@octokit/plugin-paginate-rest'
import {Version, DownloadRelease} from './types'

export async function listDownloadReleases(
  paginate: PaginateInterface
): Promise<DownloadRelease[]> {
  return paginate('GET /repos/{owner}/{repo}/releases', {
    owner: context.repo.owner,
    repo: context.repo.repo
  }).then(response => {
    const publishedVersions = response
      .filter(release => !release.draft && !release.prerelease)
      .map(release => release.tag_name)

    const versions = [] as Version[]
    for (const publishedVersion of publishedVersions) {
      const version = Version.fromTag(publishedVersion)
      if (version) {
        const major = version.major
        if (!versions[major] || version.isNewerThan(versions[major])) {
          versions[major] = version
        }
      }
    }
    const downloadReleases = [] as DownloadRelease[]
    for (const version of response) {
      const downloadRelease = DownloadRelease.fromTag(version.tag_name)
      if (downloadRelease) {
        const major = downloadRelease.major
        if (version.body) {
          downloadRelease.currentVersion = extractVersionFromBody(version.body)
        }
        downloadRelease.latestVersion = versions[major]
        downloadReleases[major] = downloadRelease
      }
    }
    return downloadReleases
  })
}

function extractVersionFromBody(body: String) {
  for (const bodyLine of body.split('\n')) {
    const version = Version.fromTag(bodyLine)
    if (version) {
      return version
    }
  }
}
