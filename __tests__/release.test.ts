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
          id: 12345,
          tag_name: 'download-latest-v0',
          body: '# Download v0\n\nThis release tracks the latest v0 available, currently v0.0.1.'
        },
        {
          id: 67890,
          tag_name: 'download-latest-v1',
          body: '# Download v1\n\nThis release tracks the latest v1 available, currently v1.0.1.'
        }
      ])
    })
  )
  const github = {
    paginate: mock
  }

  const releases = await listReleases(github as any)
  const downloadReleaseV0 = new DownloadRelease(12345, 0)
  downloadReleaseV0.currentVersion = new Version(0, 0, 1)
  downloadReleaseV0.latestVersion = new Version(0, 0, 2)
  const downloadReleaseV1 = new DownloadRelease(67890, 1)
  downloadReleaseV1.currentVersion = new Version(1, 0, 1)
  downloadReleaseV1.latestVersion = new Version(1, 0, 1)
  expect(releases).toEqual([downloadReleaseV0, downloadReleaseV1])
})
