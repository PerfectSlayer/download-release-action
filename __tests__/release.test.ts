import {listReleases} from '../src/release'
import {DownloadRelease, Version} from '../src/types'
import {expect, jest, test} from '@jest/globals'

process.env['GITHUB_REPOSITORY'] = 'owner/repo'

test('List releases', async () => {
  const mock = jest.fn()
  mock.mockReturnValueOnce(
    new Promise(resolve => {
      resolve([
        {
          tag_name: 'v0.0.1'
        },
        {
          tag_name: 'v0.0.2'
        },
        {
          tag_name: 'v1.0.0'
        },
        {
          tag_name: 'v1.0.1'
        },
        {
          tag_name: 'v2.0.0'
        },
        {
          id: 12345,
          tag_name: 'download-latest-v0',
          body: '# Download v0\n\nThis release tracks the latest v0 available, currently v0.0.1.'
        },
        {
          id: 67890,
          tag_name: 'download-latest-v1',
          body: '# Download v1\n\nThis release tracks the latest v1 available, currently v1.0.1.'
        },
        {
          id: 24680,
          tag_name: 'download-latest',
          body: '# Download latest\n\nThis release tracks the latest version available, currently v1.0.1.'
        }
      ])
    })
  )
  const github = {
    paginate: mock
  }

  const downloadReleaseV0 = new DownloadRelease(12345, 0)
  downloadReleaseV0.currentVersion = new Version(0, 0, 1)
  downloadReleaseV0.latestVersion = new Version(0, 0, 2)

  const downloadReleaseV1 = new DownloadRelease(67890, 1)

  const version_1_0_1 = new Version(1, 0, 1)
  downloadReleaseV1.currentVersion = version_1_0_1
  downloadReleaseV1.latestVersion = version_1_0_1

  const downloadLatest = new DownloadRelease(24680, -1)
  downloadLatest.currentVersion = version_1_0_1
  downloadLatest.latestVersion = new Version(2, 0, 0)

  const releases = await listReleases(github as any)
  expect(releases.length).toBe(3)
  expect(releases).toContainEqual(downloadReleaseV0)
  expect(releases).toContainEqual(downloadReleaseV1)
  expect(releases).toContainEqual(downloadLatest)
})
