import { fileURLToPath } from 'node:url'
import { defineConfig, mergeConfig } from 'vite'
import { sharedViteConfig } from './vite.shared'

export default mergeConfig(
  sharedViteConfig,
  defineConfig({
    build: {
      outDir: 'build/package',
      emptyOutDir: true,
      lib: {
        entry: fileURLToPath(new URL('../src/index.ts', import.meta.url)),
        formats: ['es'],
        fileName: 'index',
        cssFileName: 'index',
      },
      rollupOptions: { external: ['vue'] },
    },
    plugins: [
      {
        name: 'package-runtime-contract',
        generateBundle(_options, bundle) {
          Object.values(bundle).forEach((entry) => {
            if (
              entry.type === 'chunk' &&
              (entry.imports.some((name) => name !== 'vue') ||
                Object.keys(entry.modules).some((name) => name.includes('/node_modules/')))
            )
              this.error('The package must only depend on external Vue at runtime')
          })
        },
      },
    ],
  }),
)
