import { execFileSync } from 'node:child_process'
import { readFile, readdir, rename, rm } from 'node:fs/promises'

const staging = 'build/package'
const files = ['index.css', 'index.d.ts', 'index.js']

const remove = (path) =>
  rm(path, {
    recursive: true,
    force: true,
  })

const run = (path, args) =>
  execFileSync(process.execPath, [path, ...args], {
    stdio: 'inherit',
  })

await Promise.all([remove('dist'), remove(staging), remove('build/types')])

try {
  run('node_modules/vue-tsc/bin/vue-tsc.js', ['-p', 'tsconfig.build.json'])
  run('node_modules/vite/bin/vite.js', ['build', '--config', 'config/library.ts'])
  run('node_modules/rollup/dist/bin/rollup', ['-c'])

  const entries = (await readdir(staging)).sort()

  if (JSON.stringify(entries) !== JSON.stringify(files)) {
    throw new Error('Unexpected build files')
  }

  const contents = await Promise.all(files.map((name) => readFile(`${staging}/${name}`, 'utf8')))

  if (contents.some((content) => !content.trim())) {
    throw new Error('Empty build artifact')
  }

  if (/['"]@\/|\bDT[A-Z]\w*/.test(contents[1])) {
    throw new Error('Internal types leaked into declarations')
  }

  await rename(staging, 'dist')
} catch (error) {
  await Promise.all([remove(staging), remove('dist')])

  throw error
}
