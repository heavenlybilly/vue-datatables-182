import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { expect, userEvent, within } from 'storybook/test'
import CustomizationTable from './CustomizationTable.vue'

const meta = {
  title: 'Таблица/Оформление и кастомизация',
  component: CustomizationTable,
  tags: ['autodocs'],
} satisfies Meta<typeof CustomizationTable>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  name: 'Нейтральное оформление и выделение строк',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('checkbox', { name: 'Выбрать строку 1' })).toBeChecked()
    await userEvent.click(canvas.getByRole('button', { name: 'Clear selection (1)' }))
    await expect(canvas.getByRole('checkbox', { name: 'Выбрать строку 1' })).not.toBeChecked()
    const header = canvas.getByRole('columnheader', { name: 'Project' })
    await userEvent.click(within(header).getByText('Project'))
    await expect(header).toHaveAttribute('aria-sort', 'none')
    const button = within(header).getByRole('button')
    await userEvent.click(button)
    await expect(header).toHaveAttribute('aria-sort', 'ascending')
    const rect = button.getBoundingClientRect()
    await expect(rect.width).toBeGreaterThanOrEqual(24)
    await expect(Math.abs(rect.height - header.getBoundingClientRect().height)).toBeLessThanOrEqual(
      2,
    )
  },
}
export const Compact: Story = { name: 'Плотная таблица', args: { density: 'compact' } }
export const Dark: Story = {
  name: 'Тёмная тема через CSS-переменные',
  args: { theme: 'dark' },
  play: async ({ canvasElement }) => {
    const table = canvasElement.querySelector('.dt182') as HTMLElement
    await expect(getComputedStyle(table).backgroundColor).toBe('rgb(23, 33, 46)')
    const checkbox = within(canvasElement).getByRole('checkbox', { name: 'Выбрать строку 1' })
    const icon = checkbox.nextElementSibling as HTMLElement
    await expect(getComputedStyle(icon).backgroundColor).toBe('rgb(145, 181, 255)')
    await expect(getComputedStyle(icon, '::after').borderBottomColor).toBe('rgb(23, 33, 46)')
  },
}
export const Minimal: Story = { name: 'Минимальное оформление', args: { theme: 'minimal' } }
export const Narrow: Story = {
  name: 'Узкий контейнер и перенос панелей',
  args: { pinned: false },
  decorators: [() => ({ template: '<div style="width: 320px; max-width: 100%"><story /></div>' })],
  play: async ({ canvasElement }) => {
    const table = canvasElement.querySelector('.dt182') as HTMLElement
    await expect(table.scrollWidth).toBeLessThanOrEqual(table.clientWidth)
    const search = table.querySelector('.dt182-search') as HTMLElement
    const { width } = search.getBoundingClientRect()
    await userEvent.hover(search)
    await expect(search.getBoundingClientRect().width).toBe(width)
    await userEvent.click(within(canvasElement).getByRole('textbox', { name: 'Поиск' }))
    await expect(table.scrollWidth).toBeLessThanOrEqual(table.clientWidth)
  },
}
export const LargeText: Story = {
  name: 'Увеличенный текст',
  decorators: [() => ({ template: '<div style="--dt182-font-size: 1.5rem"><story /></div>' })],
}
export const LongHeaders: Story = {
  name: 'Перенос длинного заголовка',
  args: { longHeaders: true },
}
export const CustomControls: Story = {
  name: 'Внешние поиск, размер страницы и пагинация',
  args: { customControls: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }))
    await expect(canvas.getByText('2 / 4')).toBeVisible()
    await userEvent.type(canvas.getByRole('textbox', { name: 'Custom search' }), 'Project 18')
    await expect(canvas.getByText('1 / 1')).toBeVisible()
    await expect(canvas.getByRole('cell', { name: 'Project 18' })).toBeVisible()
  },
}

export const HostStyles: Story = {
  name: 'Соседство со стилями приложения',
  decorators: [
    () => ({
      template:
        '<div class="customization-host"><button type="button">Application button</button><story /></div>',
    }),
  ],
  play: async ({ canvasElement }) => {
    const applicationButton = within(canvasElement).getByRole('button', {
      name: 'Application button',
    })
    await expect(getComputedStyle(applicationButton).fontFamily).toContain('monospace')
    const sort = within(canvasElement).getByRole('button', { name: 'Сортировать: Project' })
    await expect(getComputedStyle(sort).fontFamily).not.toContain('monospace')
  },
}
