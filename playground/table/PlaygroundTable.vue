<script setup lang="ts">
import { onMounted } from 'vue'
import { useTableProps } from '~/table/useTableProps'
import { useTableRendering } from '~/useTableRendering'
import { Logger } from '~/utils/logger'
import DataTable from '@/components/DataTable.vue'
import DataTableColumn from '@/components/DataTableColumn.vue'

const { tableKey } = useTableRendering()
const { tableProps } = useTableProps()

onMounted(async () => {
  // Logger.trigger('init fields', 'mount playground table component')
  // await initFields()

  Logger.info('component mounted')
})
</script>

<template>
  <transition name="fade">
    <div
      class="playground-table-scroll-area"
      style="background-color: #fff; width: 100%"
    >
      <!--      <data-table-->
      <!--        :key="tableKey"-->
      <!--        :actions="tableParams.actions"-->
      <!--        :disallow-select-all="tableParams.disallowSelectAll"-->
      <!--        :fixed-columns-end="tableParams.fixedColumnsEnd"-->
      <!--        :fixed-columns-start="tableParams.fixedColumnsStart"-->
      <!--        :items="tableParams.items"-->
      <!--        :numbering="tableParams.numbering"-->
      <!--        :order-by="tableParams.orderBy ?? undefined"-->
      <!--        :order-direction="tableParams.orderDirection ?? undefined"-->
      <!--        :pagination="tableParams.paginationEnabled"-->
      <!--        :row-selection="tableParams.rowSelection"-->
      <!--        :rows-clickable="tableParams.rowsClickable"-->
      <!--        :rows-per-page-count="tableParams.rowsPerPage ?? undefined"-->
      <!--        :rows-per-page-options="displayedRowsPerPageOptions"-->
      <!--        :scroll-x="tableParams.scrollX"-->
      <!--        :searching="tableParams.searching"-->
      <!--        :select-on-row-click="tableParams.selectOnRowClick"-->
      <!--        :show-range-info="tableParams.showRangeInfo"-->
      <!--        :source="source"-->
      <!--        :sticky-header="tableParams.stickyHeader"-->
      <!--        :url="tableParams.url ?? undefined"-->
      <!--        :vertical-borders="tableParams.verticalBorders"-->
      <!--        @loading-end="handleLoadingEnd"-->
      <!--        @loading-start="handleLoadingStart"-->
      <!--        @row-click="handleRowClick"-->
      <!--        @update:selected-rows="handleSelectedRowsUpdate"-->
      <!--      >-->
      <!--        <template v-for="field of fields">-->
      <!--          <template v-if="field.display">-->
      <!--            <data-table-column-->
      <!--              v-if="field.cellSlot"-->
      <!--              :key="field.fieldName"-->
      <!--              :field="field.fieldName"-->
      <!--              :orderable="field.orderable"-->
      <!--              :searchable="field.searchable"-->
      <!--              :text-align="field.textAlign"-->
      <!--              :title="field.title"-->
      <!--              :width="field.width"-->
      <!--            >-->
      <!--              <template #cell="{ item, number, index }">-->
      <!--                <dynamic-template-renderer-->
      <!--                  :scope="{ item, number, index }"-->
      <!--                  :template="field.cellSlot"-->
      <!--                />-->
      <!--              </template>-->
      <!--            </data-table-column>-->
      <!--            <data-table-column-->
      <!--              v-else-->
      <!--              :key="field.fieldName"-->
      <!--              :field="field.fieldName"-->
      <!--              :orderable="field.orderable"-->
      <!--              :searchable="field.searchable"-->
      <!--              :text-align="field.textAlign"-->
      <!--              :title="field.title"-->
      <!--              :width="field.width"-->
      <!--            />-->
      <!--          </template>-->
      <!--        </template>-->

      <!--        <template #actions>-->
      <!--          <div @click.stop>-->
      <!--            <button class="btn btn-primary">...</button>-->
      <!--          </div>-->
      <!--        </template>-->
      <!--      </data-table>-->

      <data-table
        :key="tableKey"
        v-bind="tableProps"
      >
        <template #topLeftBeforeActions>before</template>
        <template #topLeftAfterActions>after</template>
        <template #topRight>right</template>

        <data-table-column
          key="id"
          field="id"
          title="Id"
        />
        <data-table-column
          key="title"
          field="title"
          searchable
          sortable
          title="Title"
        />
        <data-table-column
          field="author"
          title="Author"
        />
        <data-table-column
          field="genres"
          title="Genres"
        >
          <template #cell="{ item }">
            <div>
              {{ item.genres }}
            </div>
          </template>
        </data-table-column>
        <data-table-column
          field="published"
          title="Published"
        />
        <data-table-column
          field="pages"
          sortable
          title="Pages"
        />
        <data-table-column
          field="rating"
          title="Rating"
        />
        <data-table-column
          field="isbn"
          title="Isbn"
        />
        <data-table-column
          field="in_stock"
          title="In stock"
        />
        <data-table-column
          field="description"
          title="Description"
        />
        <data-table-column
          field="language"
          title="Language"
        />
        <data-table-column
          field="format"
          title="Format"
        />
        <data-table-column
          key="price"
          field="price"
          sortable
          text-align="center"
          title="Price"
          width="120px"
        />
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

.playground-table-scroll-area {
  height: 100%;
  overflow-y: hidden;
  padding-bottom: 30px;
  border-radius: 5px;
}
</style>
