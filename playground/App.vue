<script setup lang="ts">
import { computed, ref } from 'vue'
import { books } from '~/mocks'
import { DTSource } from '@/types'
import DataTable from '../src/components/DataTable.vue'
import DataTableColumn from '../src/components/DataTableColumn.vue'

const isHighlight = ref(false)

const classObject = computed(() => ({
  'playground-highlight': isHighlight.value,
}))

const isShow = ref(true)
const selectEnabled = ref(false)
const numberingEnabled = ref(false)
</script>

<template>
  <div
    class="playground-wrapper"
    :class="classObject"
  >
    <!--    <div class="playground-header">-->
    <!--      <div class="playground-title">Playground</div>-->
    <!--      <div>-->
    <!--        <v-checkbox-->
    <!--          v-model="isHighlight"-->
    <!--          label="highlight"-->
    <!--        />-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div class="playground-content">-->
    <!--      <div class="playground-table-wrapper">-->
    <!--        <playground-table />-->
    <!--      </div>-->

    <!--      <playground-toolbar />-->
    <!--    </div>-->

    <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px">
      <div>
        <button @click="isShow = !isShow">Show test column [now: {{ isShow }}]</button>
      </div>

      <div>
        <button @click="selectEnabled = !selectEnabled">
          selection [now: {{ selectEnabled }}]
        </button>
      </div>

      <div>
        <button @click="numberingEnabled = !numberingEnabled">
          numbering [now: {{ numberingEnabled }}]
        </button>
      </div>
    </div>

    <div style="padding: 20px; background-color: white">
      <data-table
        :items="books"
        :numbering="numberingEnabled"
        row-key="id"
        rows-clickable
        :rows-per-page-count="5"
        :rows-per-page-options="[5, 10, 20]"
        :search="true"
        select-on-row-click
        :selection="selectEnabled"
        :source="DTSource.LOCAL"
        vertical-borders
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
          class="bg-red"
          field="title"
          searchable
          sortable
          title="Title"
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
          field="author"
          title="Author"
        />
        <data-table-column
          v-if="isShow"
          key="price"
          field="price"
          sortable
          text-align="center"
          title="Price"
          width="120px"
        />
      </data-table>
    </div>
  </div>
</template>

<style lang="scss">
.playground-wrapper {
  display: grid;
  grid-template-rows: auto calc(100vh - 60px - 34px - 35px);
  padding: 30px;
  gap: 35px;
  background-color: #f6f6f6;
  overflow: hidden;

  &.playground-highlight {
    background-color: #fff !important;

    .playground-table-wrapper {
      background-color: #f6f6f6 !important;
    }

    .playground-control-group {
      background-color: #f6f6f6 !important;
    }

    .playground-tools {
      background-color: #f6f6f6 !important;
    }
  }
}

.playground-header {
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;

  .playground-title {
    font-weight: 600;
    font-size: 12px;
    color: #6c6c6c;
    text-transform: uppercase;
  }
}

.playground-content {
  display: flex;
  gap: 15px;
  min-width: 0;
}

.playground-table-wrapper {
  padding: 30px;
  border-radius: 10px;
  background-color: #fff;
  overflow: hidden;
  flex: 1;
  height: calc(100vh - 128px);
  max-height: calc(100vh - 128px);
}

.bg-red {
  background-color: red;
}
</style>
