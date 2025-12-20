import type { Preview } from '@storybook/vue3-vite'
import { mswLoader } from 'msw-storybook-addon/csf3'
import '../stories/storybook.scss'

const preview: Preview = {
  loaders: [mswLoader()],
  parameters: { layout: 'padded', controls: { expanded: true } },
}

export default preview
