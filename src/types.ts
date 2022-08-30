import {Octokit} from '@octokit/core'
import {Api} from '@octokit/plugin-rest-endpoint-methods/dist-types/types'
import {PaginateInterface} from '@octokit/plugin-paginate-rest'

class Version {
  readonly major: number
  readonly minor: number
  readonly bugfix: number

  static readonly pattern = /v(\d+)\.(\d+)\.(\d+)/

  constructor(major: number, minor: number, bugfix: number) {
    this.major = major
    this.minor = minor
    this.bugfix = bugfix
  }

  isNewerThan(other: Version): boolean {
    if (this.major > other.major) {
      return true
    } else if (this.major < other.major) {
      return false
    }
    if (this.minor > other.minor) {
      return true
    } else if (this.minor < other.minor) {
      return false
    }
    return this.bugfix > other.bugfix
  }

  tagName(): string {
    return `v${this.toString()}`
  }

  toString(): string {
    return `${this.major}.${this.minor}.${this.bugfix}`
  }

  static fromTag(tag: String): Version | undefined {
    const match = tag.match(Version.pattern)
    if (match) {
      return new Version(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]))
    }
  }
}

class DownloadRelease {
  readonly id: number
  readonly major: number
  currentVersion: Version | undefined
  latestVersion: Version | undefined

  constructor(id: number, major: number) {
    this.id = id
    this.major = major
  }

  static fromTag(id: number, tag: String): DownloadRelease | undefined {
    const pattern = /download-latest-v(\d+)/
    const match = tag.match(pattern)
    if (match) {
      return new DownloadRelease(id, parseInt(match[1]))
    }
  }

  tagName(): string {
    return `download-latest-v${this.major}`
  }

  needUpdate(): boolean {
    return (
      this.latestVersion !== undefined &&
      (this.currentVersion === undefined || this.latestVersion.isNewerThan(this.currentVersion))
    )
  }
}

// type GitHubClient = typeof GitHub
type GitHub = Octokit & Api & {paginate: PaginateInterface}

export {Version, DownloadRelease, GitHub}
