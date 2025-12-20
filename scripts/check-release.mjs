import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { appendFile, readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { checkArchiveMetadata, releaseTag } from './release-policy.mjs'

const packageJson = JSON.parse(await readFile('package.json', 'utf8'))
const tag = process.argv[2] ?? process.env.GITHUB_REF_NAME
const distTag = releaseTag(packageJson.version, tag)
const archivePath = process.argv[3]

if (archivePath) {
  const archive = await readFile(archivePath)
  const integrity = `sha512-${createHash('sha512').update(archive).digest('base64')}`
  const manifest = JSON.parse(
    await readFile(resolve(dirname(archivePath), 'manifest.json'), 'utf8'),
  )
  const actual = JSON.parse(
    execFileSync('tar', ['-xOf', resolve(archivePath), 'package/package.json'], {
      encoding: 'utf8',
    }),
  )

  checkArchiveMetadata(packageJson, actual, manifest, integrity)
}

if (process.env.GITHUB_OUTPUT) {
  await appendFile(process.env.GITHUB_OUTPUT, `dist-tag=${distTag}\n`)
}

process.stdout.write(
  `Release ${tag}: npm dist-tag ${distTag}${archivePath ? ', archive verified' : ''}\n`,
)
