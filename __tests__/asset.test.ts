import {expect, jest, test} from '@jest/globals'
import {Version} from '../src/types'
import {downloadAgentAsset} from '../src/release'
import {fail} from 'assert'
import * as fs from 'fs'

process.env['GITHUB_REPOSITORY'] = 'DataDog/dd-trace-java'
jest.setTimeout(30_000)

test('Download asset', async () => {
  const file = 'dd-java-agent-0.107.0.jar'
  const version = Version.fromTag('v0.107.0')
  if (!version) {
    fail('Failed to parse version')
  }
  await downloadAgentAsset(version)
  const stats = fs.statSync(file)
  expect(stats.size).toBe(20458941)
  fs.unlinkSync(file)
})
