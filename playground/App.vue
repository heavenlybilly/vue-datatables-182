<script setup lang="ts">
import { computed, ref } from 'vue'
import PlaygroundTable from '~/table/PlaygroundTable.vue'
import PlaygroundToolbar from '~/toolbar/PlaygroundToolbar.vue'
import VCheckbox from '~/toolbar/components/VCheckbox.vue'
import { usePersistentState } from '~/usePersistentState'

const isHighlight = ref(false)

usePersistentState('playground-is-highlight', isHighlight)

const classObject = computed(() => ({
  'playground-highlight': isHighlight.value,
}))
</script>

<template>
  <div
    class="playground-wrapper"
    :class="classObject"
  >
    <div class="playground-header">
      <div class="playground-title">Vue Datatables 182</div>
      <div>
        <v-checkbox
          v-model="isHighlight"
          label="highlight"
        />
      </div>
    </div>

    <div class="playground-content">
      <div class="playground-table-wrapper">
        <playground-table />
      </div>

      <div class="playground-toolbar-wrapper">
        <playground-toolbar />
      </div>
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
  height: calc(100vh - 128px);
  max-height: calc(100vh - 128px);
}

.playground-table-wrapper {
  padding: 30px;
  border-radius: 10px;
  background-color: #fff;
  overflow: hidden;
  flex: 1;
}

.playground-toolbar-wrapper {
  padding: 30px;
  border-radius: 10px;
  background-color: #fff;
  overflow-y: scroll;
}
</style>
