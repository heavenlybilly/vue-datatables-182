import { defineConfig, mergeConfig } from 'vitest/config'
import { sharedViteConfig } from './config/vite.shared'

export default mergeConfig(
  sharedViteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: false,
      include: ['tests/**/*.spec.ts'],
      restoreMocks: true,
      coverage: {
        provider: 'v8',
        reportsDirectory: 'coverage',
        reporter: ['text', 'lcov'],
        include: ['src/**/*.{ts,vue}'],
        exclude: ['src/**/*.d.ts', 'src/types/**', 'src/index.ts'],
      },
    },
  }),
)
