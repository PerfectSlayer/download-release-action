import {getDownloadReleases} from '../src/release'
import {PaginateInterface} from '@octokit/plugin-paginate-rest'

import {expect, test, jest} from '@jest/globals'

test('get download releases', async () => {
  // jest.fn(() => new Promise(resolve) => {
  //     res
  // })

  const mock = jest.fn()
  mock.mockReturnValueOnce(
    new Promise(resolve => {
      resolve([
        {
          tag_name: 'v1.0.0'
        }
      ])
    })
  )

  // var paginate: PaginateInterface;
  // paginate = () => new Promise((resolve) => {
  //     resolve("");
  // });
  const releases = await getDownloadReleases(mock as any)
})
