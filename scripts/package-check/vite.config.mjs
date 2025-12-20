import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'firefox84',
    cssTarget: 'firefox84',
    rollupOptions: {
      input: {
        app: 'index.html',
        documentation: 'documentation-entry.ts',
      },
    },
  },
})
