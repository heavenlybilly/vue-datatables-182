import vue from '@vitejs/plugin-vue2'
import svgLoader from 'vite-svg-loader'
import path from 'node:path'
import { defineConfig } from 'vite'
import { mockApiPlugin } from './playground/server/mock-api'

export default defineConfig({
  plugins: [
    vue(),
    svgLoader({
      defaultImport: 'raw',
    }),
    mockApiPlugin(),
  ],
  resolve: {
    alias: [
      {
        find: '~',
        replacement: path.resolve('playground'),
      },
      {
        find: '@',
        replacement: path.resolve('src'),
      },
      {
        find: 'vue',
        replacement: 'vue/dist/vue.esm.js',
      },
    ],
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
})
