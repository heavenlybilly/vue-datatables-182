import type { Meta, StoryObj } from '@storybook/vue3-vite'
import LocalBenchmark from './LocalBenchmark.vue'

const meta = { title: 'Таблица/Производительность', component: LocalBenchmark } satisfies Meta<
  typeof LocalBenchmark
>
export default meta
export const LocalData: StoryObj<typeof meta> = { name: 'Обновление local data в браузере' }
