import alias from '@rollup/plugin-alias'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import ts from 'rollup-plugin-typescript2'
import { dts } from 'rollup-plugin-dts'
import vue from '@vitejs/plugin-vue2'
import postcss from 'rollup-plugin-postcss'
import { string } from 'rollup-plugin-string'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import path from 'node:path'

const dirname = path.resolve()

function createAliasPlugin() {
  return alias({
    entries: [
      { find: '@', replacement: path.resolve(dirname, 'src') },
    ],
  })
}

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/vue-datatables-182.umd.js',
        format: 'cjs',
        sourcemap: false,
      },
      {
        file: 'dist/vue-datatables-182.es.js',
        format: 'es',
        sourcemap: false,
      },
    ],
    plugins: [
      createAliasPlugin(),
      nodeResolve(),
      commonjs(),
      ts({
        tsconfig: path.resolve(dirname, 'tsconfig.json'),
      }),
      vue(),
      postcss({
        extract: 'index.css',
        minimize: true,
        extensions: ['.scss'],
        use: [
          [
            'sass',
            {
              includePaths: ['./src/scss'],
            },
          ],
        ],
      }),
      string({
        include: '**/*.svg',
        exclude: 'node_modules/**',
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        extensions: ['.js', '.ts', '.vue']
      }),
      terser(),
    ],
    external: ['vue'],
  },
  {
    input: 'src/declare-types/index.d.ts',
    output: [
      {
        file: 'dist/index.d.ts',
        format: 'es',
      },
    ],
    plugins: [
      createAliasPlugin(),
      dts(),
    ],
  },
]