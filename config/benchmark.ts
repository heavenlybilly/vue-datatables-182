import { defineConfig, mergeConfig } from 'vitest/config'
import { sharedViteConfig } from './vite.shared'

export default mergeConfig(
  sharedViteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      include: ['tests/performance/*.benchmark.ts'],
      testTimeout: 120000,
      coverage: { enabled: false },
    },
  }),
)
