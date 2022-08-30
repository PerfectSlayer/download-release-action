import {DownloadRelease, Version} from '../src/types'
import {expect, test} from '@jest/globals'

test('Version tag parsing', async () => {
  expect(Version.fromTag('v1.2.3')).toStrictEqual(new Version(1, 2, 3))
  expect(Version.fromTag('1.2.3')).toBe(undefined)
  expect(Version.fromTag('v1.2')).toBe(undefined)
})

test('Version ordering', async () => {
  // Major differs
  expect(new Version(1, 2, 3).isNewerThan(new Version(0, 2, 3))).toBe(true)
  expect(new Version(1, 2, 3).isNewerThan(new Version(2, 2, 3))).toBe(false)
  // Minor differs
  expect(new Version(1, 2, 3).isNewerThan(new Version(1, 1, 3))).toBe(true)
  expect(new Version(1, 2, 3).isNewerThan(new Version(1, 3, 3))).toBe(false)
  // Bugfix differs
  expect(new Version(1, 2, 3).isNewerThan(new Version(1, 2, 2))).toBe(true)
  expect(new Version(1, 2, 3).isNewerThan(new Version(1, 2, 4))).toBe(false)
  // Same
  expect(new Version(1, 2, 3).isNewerThan(new Version(1, 2, 3))).toBe(false)
})

test('Download release tag parsing', () => {
  expect(DownloadRelease.fromTag(123456, 'download-latest-v1')).toStrictEqual(new DownloadRelease(123456, 1))
  expect(DownloadRelease.fromTag(123456, 'download-latest-v')).toBe(undefined)
  expect(DownloadRelease.fromTag(123456, 'v1.2.3')).toBe(undefined)
})

test('Download release formatting', () => {
  const release = DownloadRelease.fromTag(123456, 'download-latest-v125')
  expect(release).toBeDefined()
  expect(release?.id).toBe(123456)
  expect(release?.major).toBe(125)
})

test('Download release update', () => {
  const release = new DownloadRelease(123456, 1)
  // No latest version should not trigger an update
  expect(release.needUpdate()).toBe(false)
  release.latestVersion = new Version(1, 2, 3)
  // No current version but latest version should trigger an update
  expect(release.needUpdate()).toBe(true)
  // Same version should not trigger an update
  release.currentVersion = new Version(1, 2, 3)
  expect(release.needUpdate()).toBe(false)
  // Default tests
  release.currentVersion = new Version(1, 2, 4)
  expect(release.needUpdate()).toBe(false)
  release.currentVersion = new Version(1, 2, 1)
  expect(release.needUpdate()).toBe(true)
})
