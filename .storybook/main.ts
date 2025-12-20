import type { StorybookConfig } from '@storybook/vue3-vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { mergeConfig } from 'vite'
import svgLoader from 'vite-svg-loader'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.ts'],
  addons: ['@storybook/addon-docs', '@storybook/addon-vitest', 'msw-storybook-addon'],
  framework: { name: '@storybook/vue3-vite', options: { docgen: false } },
  staticDirs: ['./public'],
  viteFinal: (base) =>
    mergeConfig(base, {
      resolve: { alias: { '@': path.resolve('src') } },
      plugins: [vue(), svgLoader({ defaultImport: 'raw' })],
      build: { target: 'firefox84', cssTarget: 'firefox84' },
    }),
}

export default config
