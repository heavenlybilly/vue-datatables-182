<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import ColumnControl from '../../components/ColumnControl.vue';
import StateViewer from '../../components/StateViewer.vue';
import VCheckbox from '../../components/VCheckbox.vue';
import VInput from '../../components/VInput.vue';
import VSelect from '../../components/VSelect.vue';
import { books } from '../../mocks';
import ControlGroup from './ControlGroup.vue';
import ExampleBlock from './ExampleBlock.vue';
import { usePersistentState } from './usePersistentState';


// @ts-ignore
const remoteUrl = window.remoteUrl

type FieldDef = {
  fieldName: string
  title: string
  display: boolean
  searchable: boolean
  orderable: boolean
  width?: string
  textAlign?: 'right' | 'left' | 'center'
  cellSlot?: string
}

const showTable = ref<boolean>(false)
const source = ref<'local' | 'remote'>('local')
const fields = ref<Record<string, FieldDef>>({})

const expanded = reactive({
  fields: false,
  pagination: false,
  order: false,
  scrollAndFix: false,
  other: false,
  state: false,
})

const selectedRows = ref<any[]>([])
const advanced = ref(false)

const pagination = ref(true)
const rowsPerPageOptionsRaw = ref('5, 10, 25, 50, 100')
const rowsPerPageCount = ref(5)

const orderBy = ref(null)
const orderDirection = ref(null)

const searching = ref(true)
const rowSelection = ref(false)
const actions = ref(false)
const numbering = ref(false)
const rowsClickable = ref(false)

const scrollX = ref(false)
const fixedColumnsStart = ref(null)
const fixedColumnsEnd = ref(null)

const { triggerUpdateState } = usePersistentState(
  `playground-view-state`,
  source,
  {
    fields,
    advanced,
    pagination,
    rowsPerPageOptionsRaw,
    rowsPerPageCount,
    orderBy,
    orderDirection,
    searching,
    rowSelection,
    actions,
    numbering,
    rowsClickable,
    scrollX,
    fixedColumnsStart,
    fixedColumnsEnd,
    expanded,
  },
)

const renderTrigger = computed(() => ({
  ...fields,
  pagination,
  rowsPerPageOptionsRaw,
  rowsPerPageCount,
  orderBy,
  orderDirection,
  searching,
  rowSelection,
  actions,
  numbering,
  rowsClickable,
  scrollX,
  fixedColumnsStart,
  fixedColumnsEnd,
}))

const displayedState = computed(() => ({
  selectedRows: selectedRows.value,
}))

const rowsPerPageOptions = computed((): number[] | undefined => {
  if (!rowsPerPageOptionsRaw.value) {
    return undefined
  }

  return rowsPerPageOptionsRaw.value
    .split(',')
    .map((item) => +item.trim())
    .filter((num) => Number.isInteger(num) && num > 0)
})

const orderByOptions = computed((): string[] => {
  return Object.keys(fields)
})

const fixedColumnsStartPrettified = computed(() => {
  return fixedColumnsStart.value !== null ? +fixedColumnsStart.value : undefined
})

const fixedColumnsEndPrettified = computed(() => {
  return fixedColumnsEnd.value !== null ? +fixedColumnsEnd.value : undefined
})

const handleUpdateSelectedRows = (value: any[]) => {
  selectedRows.value = value
}

const handleLoadingStart = () => {
  console.log('loading start')
}

const handleLoadingEnd = (value: any) => {
  console.log('loading end', value)
}

const applySourceChange = async () => {
  showTable.value = false
  triggerUpdateState()

  let newFieldNames: string[] = []

  if (source.value === 'local') {
    if (books.length) {
      newFieldNames = Object.keys(books[0])
    } else {
      console.error('Данных нет.')
    }
  } else if (source.value === 'remote') {
    try {
      const response = await fetch(remoteUrl)
      const json = await response.json()

      const firstItem = json.data?.[0]

      if (firstItem) {
        newFieldNames = Object.keys(firstItem)
      } else {
        console.error('Данных нет.')
      }
    } catch(error) {
      console.error('Ошибка при выполнения запроса', error)
    }
  }

  const resultFields: any = {}
  for (const fieldName of newFieldNames) {
    if (!!fields.value?.[fieldName]) {
      resultFields[fieldName] = fields.value[fieldName]
      continue
    }

    resultFields[fieldName] = {
      fieldName,
      title: String(fieldName).charAt(0).toUpperCase() + String(fieldName).slice(1),
      display: true,
      searchable: false,
      orderable: false,
      width: undefined,
      textAlign: undefined,
      sellSlot: undefined,
    }
  }

  fields.value = resultFields
  showTable.value = true
}

watch(source, applySourceChange)

onMounted(() => {
  applySourceChange()
})
</script>

<template>
  <example-block
    title="Static source"
    :render-trigger="renderTrigger"
    :source.sync="source"
  >
    <template #control>
      <control-group
        title="Параметры полей"
        :expanded.sync="expanded.fields"
      >
        <v-checkbox
          v-model="advanced"
          label="Расширенные настройки"
        ></v-checkbox>

        <div
          style="
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
            grid-gap: 10px;
            margin-top: 10px;
          "
        >
          <column-control
            v-for="(value, key) in fields"
            :key="key"
            v-model="fields[key]"
            :advanced="advanced"
            :title="fields[key].title"
          ></column-control>
        </div>
      </control-group>

      <control-group
        title="Пагинация"
        :expanded.sync="expanded.pagination"
      >
        <div style="display: inline-flex; flex-direction: column; gap: 15px">
          <div style="display: inline-flex; gap: 15px">
            <v-checkbox
              v-model="pagination"
              label="Пагинация"
            ></v-checkbox>
          </div>

          <v-input
            v-model="rowsPerPageOptionsRaw"
            label="Кол-во на странице (options)"
          ></v-input>

          <v-select
            v-model="rowsPerPageCount"
            :options="rowsPerPageOptions ?? []"
            label="Кол-во на странице"
          ></v-select>
        </div>
      </control-group>

      <control-group
        title="Сортировка"
        :expanded.sync="expanded.order"
      >
        <div style="display: inline-flex; flex-direction: column; gap: 15px">
          <v-select
            v-model="orderBy"
            :options="orderByOptions"
            label="Поле для сортировки"
          ></v-select>

          <v-select
            v-model="orderDirection"
            :options="['asc', 'desc']"
            label="Направление сортировки"
          ></v-select>
        </div>
      </control-group>

      <control-group
        title="Прокрутка и закрепление столбцов"
        :expanded.sync="expanded.scrollAndFix"
      >
        <div style="display: inline-flex; flex-direction: column; gap: 15px">
          <div style="display: inline-flex; gap: 15px">
            <v-checkbox
              v-model="scrollX"
              label="Горизонтальная прокрутка"
            ></v-checkbox>
          </div>

          <v-input
            v-model="fixedColumnsStart"
            label="Закрепленных столбцов в начале таблицы"
          ></v-input>

          <v-input
            v-model="fixedColumnsEnd"
            label="Закрепленных столбцов в конце таблицы"
          ></v-input>
        </div>
      </control-group>

      <control-group
        title="Другие параметры"
        :expanded.sync="expanded.other"
      >
        <div style="display: inline-flex; gap: 15px">
          <v-checkbox
            v-model="searching"
            label="Поиск"
          ></v-checkbox>
          <v-checkbox
            v-model="rowSelection"
            label="Выбор строк"
          ></v-checkbox>
          <v-checkbox
            v-model="actions"
            label="Действия"
          ></v-checkbox>
          <v-checkbox
            v-model="numbering"
            label="Нумерация строк"
          ></v-checkbox>
          <v-checkbox
            v-model="rowsClickable"
            label="Обработка события click на строке"
          ></v-checkbox>
        </div>
      </control-group>

      <control-group
        title="Отображение состояния"
        :expanded.sync="expanded.state"
      >
        <state-viewer
          title="Основное"
          :value="displayedState"
        ></state-viewer>
      </control-group>
    </template>

    <data-table
      v-if="showTable"
      :source="source"
      :items="books"
      :url="remoteUrl"
      :pagination="pagination"
      :rows-per-page-count="rowsPerPageCount ?? undefined"
      :rows-per-page-options="rowsPerPageOptions"
      :searching="searching"
      :row-selection="rowSelection"
      :actions="actions"
      :numbering="numbering"
      :rows-clickable="rowsClickable"
      :scroll-x="scrollX"
      :fixed-columns-start="fixedColumnsStartPrettified"
      :fixed-columns-end="fixedColumnsEndPrettified"
      :order-by="orderBy ?? undefined"
      :order-direction="orderDirection ?? undefined"
      @update:selected-rows="handleUpdateSelectedRows"
      @loading-start="handleLoadingStart"
      @loading-end="handleLoadingEnd"
    >
      <template v-for="field of fields">
        <data-table-column
          v-if="field.display"
          :title="field.title"
          :field="field.fieldName"
          :searchable="field.searchable"
          :orderable="field.orderable"
          :width="field.width"
          :textAlign="field.textAlign"
        />
      </template>

      <template #actions="row">
        <div @click.stop>
          <button class="btn btn-primary">...</button>
        </div>
      </template>
    </data-table>
  </example-block>
</template>

<style lang="scss"></style>
