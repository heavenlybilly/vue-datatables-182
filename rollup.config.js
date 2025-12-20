import { dts } from 'rollup-plugin-dts'

export default {
  input: 'build/types/index.d.ts',
  output: { file: 'build/package/index.d.ts', format: 'es' },
  plugins: [dts()],
  external: ['vue'],
}
