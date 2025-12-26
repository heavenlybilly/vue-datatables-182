<script setup lang="ts">
import SearchField from '@/components/layout/controls/SearchField.vue'
import { ColumnRegistry } from '../columns/types'
import { Core } from '../core/types'
import { Interactor } from '../interactor/types'
import Toolbar from './containers/Toolbar.vue'
import Wrapper from './containers/Wrapper.vue'

const props = defineProps<{
  core: Core
  columnRegistry: ColumnRegistry
  interactor: Interactor
  searchEnabled: boolean
}>()
</script>

<template>
  <wrapper>
    <toolbar>
      <template #topLeftBeforeActions>
        <slot name="topLeftBeforeActions"></slot>
      </template>
      <template #topSearch>
        <search-field
          v-if="props.searchEnabled"
          :value="props.core.state.searchQuery"
          @update:value="props.interactor.handlers.searchInput"
        />
      </template>
      <template #topLeftAfterActions>
        <slot name="topLeftAfterActions"></slot>
      </template>
      <template #topRight>
        <slot name="topRight"></slot>
      </template>
    </toolbar>
  </wrapper>
</template>

<style lang="scss"></style>
