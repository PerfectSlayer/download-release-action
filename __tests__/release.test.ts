import {listDownloadReleases} from '../src/release'
import {DownloadRelease, Version} from '../src/types'
import {expect, test, jest} from '@jest/globals'

test('get download releases', async () => {
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
          tag_name: 'download-latest-v0',
          body: '# Download v0\n\nThis release tracks the latest v0 available, currently v0.0.1.'
        },
        {
          tag_name: 'download-latest-v1',
          body: '# Download v0\n\nThis release tracks the latest v0 available, currently v1.0.1.'
        }
      ])
    })
  )

  const releases = await listDownloadReleases(mock as any)
  const downloadReleaseV0 = new DownloadRelease(0)
  downloadReleaseV0.currentVersion = new Version(0, 0, 1)
  downloadReleaseV0.latestVersion = new Version(0, 0, 2)
  const downloadReleaseV1 = new DownloadRelease(1)
  downloadReleaseV1.currentVersion = new Version(1, 0, 1)
  downloadReleaseV1.latestVersion = new Version(1, 0, 1)
  expect(releases).toEqual([downloadReleaseV0, downloadReleaseV1])
})
