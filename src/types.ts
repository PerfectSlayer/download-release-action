class Version {
  major: number
  minor: number
  bugfix: number

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

  static fromTag(tag: String) {
    const match = tag.match(Version.pattern)
    if (match) {
      return new Version(
        parseInt(match[1]),
        parseInt(match[2]),
        parseInt(match[3])
      )
    }
  }
}

class Release {
  version: Version

  constructor(version: Version) {
    this.version = version
  }
}

class DownloadRelease {
  major: number
  currentVersion: Version | undefined
  latestVersion: Version | undefined

  constructor(major: number) {
    this.major = major
  }

  static fromTag(tag: String) {
    const pattern = /download-latest-v(\d+)/
    const match = tag.match(pattern)
    if (match) {
      return new DownloadRelease(parseInt(match[1]))
    }
  }

  needUpdate() {
    return (
      this.currentVersion !== undefined &&
      this.latestVersion !== undefined &&
      this.latestVersion.isNewerThan(this.currentVersion)
    )
  }
}

export {Version, DownloadRelease}
