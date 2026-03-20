// eslint-disable-next-line import/no-extraneous-dependencies
import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'
import { TextAlign } from '@/components/types'

export type ColumnConfig = {
  field: string
  title: string
  visible: boolean
  searchable: boolean
  sortable: boolean
  width: string
  textAlign: TextAlign | ''
}

const STORAGE_KEY = 'playground-columns'

const defaultColumns: ColumnConfig[] = [
  {
    field: 'id',
    title: 'Id',
    visible: true,
    searchable: false,
    sortable: false,
    width: '',
    textAlign: '',
  },
  {
    field: 'title',
    title: 'Title',
    visible: true,
    searchable: true,
    sortable: true,
    width: '',
    textAlign: '',
  },
  {
    field: 'author',
    title: 'Author',
    visible: true,
    searchable: false,
    sortable: false,
    width: '',
    textAlign: '',
  },
  {
    field: 'genres',
    title: 'Genres',
    visible: true,
    searchable: false,
    sortable: false,
    width: '',
    textAlign: '',
  },
  {
    field: 'published',
    title: 'Published',
    visible: true,
    searchable: false,
    sortable: false,
    width: '',
    textAlign: '',
  },
  {
    field: 'pages',
    title: 'Pages',
    visible: true,
    searchable: false,
    sortable: true,
    width: '',
    textAlign: '',
  },
  {
    field: 'rating',
    title: 'Rating',
    visible: true,
    searchable: false,
    sortable: false,
    width: '',
    textAlign: '',
  },
  {
    field: 'isbn',
    title: 'Isbn',
    visible: true,
    searchable: false,
    sortable: false,
    width: '',
    textAlign: '',
  },
  {
    field: 'in_stock',
    title: 'In stock',
    visible: true,
    searchable: false,
    sortable: false,
    width: '',
    textAlign: '',
  },
  {
    field: 'language',
    title: 'Language',
    visible: true,
    searchable: false,
    sortable: false,
    width: '',
    textAlign: '',
  },
  {
    field: 'format',
    title: 'Format',
    visible: true,
    searchable: false,
    sortable: false,
    width: '',
    textAlign: '',
  },
  {
    field: 'price',
    title: 'Price',
    visible: true,
    searchable: false,
    sortable: true,
    width: '120px',
    textAlign: 'center',
  },
  {
    field: 'description',
    title: 'Description',
    visible: false,
    searchable: false,
    sortable: false,
    width: '300px',
    textAlign: '',
  },
]

export const useColumnsStore = defineStore('playground-columns', () => {
  const columns = ref<ColumnConfig[]>([...defaultColumns.map((c) => ({ ...c }))])

  const load = () => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ColumnConfig[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          columns.value = parsed
        }
      } catch {
        // use defaults
      }
    }
  }

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columns.value))
  }

  const updateColumn = (field: string, patch: Partial<ColumnConfig>) => {
    const col = columns.value.find((c) => c.field === field)
    if (col) {
      Object.assign(col, patch)
      save()
    }
  }

  const moveColumn = (field: string, direction: 'up' | 'down') => {
    const idx = columns.value.findIndex((c) => c.field === field)
    if (idx < 0) return

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= columns.value.length) return

    const [removed] = columns.value.splice(idx, 1)
    columns.value.splice(targetIdx, 0, removed)
    save()
  }

  const resetColumns = () => {
    columns.value = [...defaultColumns.map((c) => ({ ...c }))]
    save()
  }

  onMounted(() => {
    load()
  })

  return {
    columns,
    updateColumn,
    moveColumn,
    resetColumns,
  }
})
