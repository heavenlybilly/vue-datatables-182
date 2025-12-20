import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import svgLoader from 'vite-svg-loader'

export const sharedViteConfig = {
  build: { target: 'firefox84', cssTarget: 'firefox84' },
  plugins: [vue(), svgLoader({ defaultImport: 'raw' })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('../src', import.meta.url)),
    },
  },
}
