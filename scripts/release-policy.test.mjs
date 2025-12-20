import assert from 'node:assert/strict'
import { test } from 'node:test'
import { checkArchiveMetadata, releaseTag } from './release-policy.mjs'

test('stable and supported prereleases use their exact dist-tags', () => {
  assert.equal(releaseTag('2.0.0', 'v2.0.0'), 'latest')
  ;['alpha', 'beta', 'rc'].forEach((channel) => {
    assert.equal(releaseTag(`2.0.0-${channel}.0`, `v2.0.0-${channel}.0`), channel)
  })
})

test('mismatched tags, noncanonical versions and unknown channels fail', () => {
  ;[
    ['2.0.0', 'v2.0.1'],
    ['2.0.0', '2.0.0'],
    ['02.0.0', 'v02.0.0'],
    ['2.0.0-preview.0', 'v2.0.0-preview.0'],
    ['2.0.0-alpha.0', 'v2.0.0'],
  ].forEach(([version, tag]) => {
    assert.throws(() => releaseTag(version, tag))
  })
})

test('archive identity and checksum must match the checked manifest', () => {
  const expected = {
    name: 'vue-datatables-182',
    version: '2.0.0',
  }
  const manifest = {
    ...expected,
    integrity: 'sha512-checked',
  }

  checkArchiveMetadata(expected, expected, manifest, manifest.integrity)
  assert.throws(() =>
    checkArchiveMetadata(
      expected,
      {
        ...expected,
        version: '1.0.0',
      },
      manifest,
      manifest.integrity,
    ),
  )
  assert.throws(() =>
    checkArchiveMetadata(
      expected,
      {
        ...expected,
        name: 'other',
      },
      manifest,
      manifest.integrity,
    ),
  )
  assert.throws(() =>
    checkArchiveMetadata(
      expected,
      expected,
      {
        ...manifest,
        version: '1.0.0',
      },
      manifest.integrity,
    ),
  )
  assert.throws(() => checkArchiveMetadata(expected, expected, manifest, 'sha512-modified'))
})
