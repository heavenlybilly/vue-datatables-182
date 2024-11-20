import vue from '@vitejs/plugin-vue2'
import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve('..', 'src'),
      },
    ],
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
