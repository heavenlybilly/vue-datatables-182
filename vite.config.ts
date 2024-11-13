import alias from '@rollup/plugin-alias'
import vue from '@vitejs/plugin-vue2'
import * as path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import svgr from "vite-plugin-svgr"

export default defineConfig({
  plugins: [
    alias({
      entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    }),
    vue(),
    dts({
      insertTypesEntry: true,
    }),
    svgr(),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'VueDatatables182',
      fileName: (format) => `vue-datatables-182.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  }
})
