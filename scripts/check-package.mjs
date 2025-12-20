import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { copyDocumentationExamples } from './documentation-examples.mjs'

const root = resolve('.')
const directory = await mkdtemp(join(tmpdir(), 'vue-datatables-package-'))
const outputIndex = process.argv.indexOf('--output')
const output = outputIndex === -1 ? null : process.argv[outputIndex + 1]

if (outputIndex !== -1 && (!output || output.startsWith('--'))) {
  throw new Error('--output requires a directory')
}

const run = (command, args, cwd = directory) =>
  execFileSync(command, args, {
    cwd,
    stdio: 'inherit',
  })

const version = async (name) =>
  JSON.parse(await readFile(join(root, 'node_modules', name, 'package.json'), 'utf8')).version

try {
  const packed = JSON.parse(
    execFileSync(
      'npm',
      ['pack', '--foreground-scripts=false', '--json', '--pack-destination', directory],
      {
        cwd: root,
        encoding: 'utf8',
      },
    ),
  )[0]

  assert.deepEqual(packed.files.map(({ path }) => path).sort(), [
    'LICENSE',
    'dist/index.css',
    'dist/index.d.ts',
    'dist/index.js',
    'package.json',
    'readme.md',
  ])
  await cp(join(root, 'scripts/package-check'), directory, {
    recursive: true,
  })
  await copyDocumentationExamples(root, directory)

  const dependencies = {
    'vue-datatables-182': `file:./${packed.filename}`,
    vue: '3.5.41',
  }
  const devDependencies = {
    vite: await version('vite'),
    '@vitejs/plugin-vue': await version('@vitejs/plugin-vue'),
    typescript: await version('typescript'),
    'vue-tsc': await version('vue-tsc'),
    jsdom: await version('jsdom'),
    webpack: '5.111.1',
    'webpack-cli': '6.0.1',
    'vue-loader': '17.4.2',
    'ts-loader': '9.6.2',
    'css-loader': '7.1.5',
    'style-loader': '4.0.0',
  }

  await writeFile(
    join(directory, 'package.json'),
    `${JSON.stringify(
      {
        private: true,
        type: 'module',
        dependencies,
        devDependencies,
      },
      null,
      2,
    )}\n`,
  )
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'])

  const checkConsumer = async () => {
    run(process.execPath, ['node_modules/vue-tsc/bin/vue-tsc.js', '--noEmit'])
    run(process.execPath, ['node_modules/vite/bin/vite.js', 'build'])
    run(process.execPath, ['node_modules/webpack-cli/bin/cli.js'])
    run(process.execPath, ['ssr.mjs'])
    run(process.execPath, ['mount.mjs'])

    const assets = await readdir(join(directory, 'dist/assets'))
    const stylesheet = assets.find((name) => name.endsWith('.css'))

    assert.ok(stylesheet, 'Vite must retain package styles')

    const css = await readFile(join(directory, 'dist/assets', stylesheet), 'utf8')

    assert.ok(css.includes('.dt182-'))

    const webpack = await readFile(join(directory, 'dist-webpack/app.js'), 'utf8')

    assert.ok(webpack.includes('.dt182-'), 'Webpack must retain package styles')
  }

  await checkConsumer()
  run('npm', [
    'install',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    'vue@3.5.0',
    'typescript@5.5.4',
  ])
  await checkConsumer()

  if (output) {
    const archive = await readFile(join(directory, packed.filename))
    const manifest = {
      name: packed.name,
      version: packed.version,
      integrity: `sha512-${createHash('sha512').update(archive).digest('base64')}`,
    }

    await mkdir(resolve(output), {
      recursive: true,
    })
    await writeFile(join(resolve(output), 'package.tgz'), archive)
    await writeFile(
      join(resolve(output), 'manifest.json'),
      `${JSON.stringify(manifest, null, 2)}\n`,
    )
  }

  process.stdout.write(
    `Package archive and consumer checks passed${process.argv.includes('--keep') ? `: ${directory}` : ''}\n`,
  )
} finally {
  if (!process.argv.includes('--keep')) {
    await rm(directory, {
      recursive: true,
      force: true,
    })
  }
}
