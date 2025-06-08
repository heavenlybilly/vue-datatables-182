<script setup lang="ts">
import { onMounted } from 'vue'
import { useTableFields } from '~/composables/useTableFields'
import { useTableParams } from '~/composables/useTableParams'
import { useTableRendering } from '~/composables/useTableRendering'
import { useTableSource } from '~/composables/useTableSource'
import { books } from '~/mocks'
import { Logger } from '~/utils/logger'
import DynamicTemplateRenderer from './DynamicTemplateRenderer.vue'

const { isTableVisible } = useTableRendering()
const { tableParams, displayedRowsPerPageOptions, setTableParams } = useTableParams()
const { source } = useTableSource()
const { fields, initFields } = useTableFields()

const handleLoadingStart = () => {
  Logger.event('loading start')
}

const handleLoadingEnd = (value: object) => {
  Logger.event('loading end', { ...value })
}

const handleRowClick = (value: object) => {
  Logger.event('row click', { ...value })
}

const handleSelectedRowsUpdate = (value: object[]) => {
  Logger.event(
    'update selected rows',
    value.map((item) => ({
      ...item,
    })),
  )
}

onMounted(async () => {
  if (!tableParams.value.items.length) {
    setTableParams({
      items: books,
    })
  }

  Logger.trigger('init fields', 'mount playground table component')
  await initFields()

  Logger.info('component mounted')
})
</script>

<template>
  <transition name="fade">
    <div
      v-if="isTableVisible"
      style="background-color: #fff; width: 100%"
    >
      <data-table
        :actions="tableParams.actions"
        :fixed-columns-end="tableParams.fixedColumnsEnd"
        :fixed-columns-start="tableParams.fixedColumnsStart"
        :items="tableParams.items"
        :numbering="tableParams.numbering"
        :order-by="tableParams.orderBy ?? undefined"
        :order-direction="tableParams.orderDirection ?? undefined"
        :pagination="tableParams.paginationEnabled"
        :row-selection="tableParams.rowSelection"
        :rows-clickable="tableParams.rowsClickable"
        :rows-per-page-count="tableParams.rowsPerPage ?? undefined"
        :rows-per-page-options="displayedRowsPerPageOptions"
        :scroll-x="tableParams.scrollX"
        :searching="tableParams.searching"
        :source="source"
        :url="tableParams.url ?? undefined"
        @loading-end="handleLoadingEnd"
        @loading-start="handleLoadingStart"
        @row-click="handleRowClick"
        @update:selected-rows="handleSelectedRowsUpdate"
      >
        <template v-for="field of fields">
          <template v-if="field.display">
            <data-table-column
              v-if="field.cellSlot"
              :key="field.fieldName"
              :field="field.fieldName"
              :orderable="field.orderable"
              :searchable="field.searchable"
              :text-align="field.textAlign"
              :title="field.title"
              :width="field.width"
            >
              <template #cell="{ item, number, index }">
                <dynamic-template-renderer
                  :scope="{ item, number, index }"
                  :template="field.cellSlot"
                />
              </template>
            </data-table-column>
            <data-table-column
              v-else
              :key="field.fieldName"
              :field="field.fieldName"
              :orderable="field.orderable"
              :searchable="field.searchable"
              :text-align="field.textAlign"
              :title="field.title"
              :width="field.width"
            />
          </template>
        </template>

        <template #actions>
          <div @click.stop>
            <button class="btn btn-primary">...</button>
          </div>
        </template>
      </data-table>
    </div>
  </transition>
</template>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
