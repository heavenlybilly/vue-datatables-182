import assert from 'node:assert/strict'
import { prerelease, valid } from 'semver'

export function releaseTag(version, tag) {
  assert.equal(valid(version), version, 'Package version must be canonical SemVer')
  assert.equal(tag, `v${version}`, 'Git tag must exactly match package.json version')

  const identifiers = prerelease(version)

  if (!identifiers) {
    return 'latest'
  }

  const [channel] = identifiers

  assert.ok(['alpha', 'beta', 'rc'].includes(channel), 'Unsupported prerelease channel')

  return channel
}

export function checkArchiveMetadata(expected, actual, manifest, integrity) {
  assert.equal(actual.name, expected.name, 'Archive package name mismatch')
  assert.equal(actual.version, expected.version, 'Archive package version mismatch')
  assert.equal(manifest.name, actual.name, 'Manifest package name mismatch')
  assert.equal(manifest.version, actual.version, 'Manifest package version mismatch')
  assert.equal(manifest.integrity, integrity, 'Archive checksum mismatch')
}
