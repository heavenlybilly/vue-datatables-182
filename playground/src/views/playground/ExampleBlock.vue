<script setup lang="ts">
import { ref, watch } from 'vue'
import SourceSwitcher from './SourceSwitcher.vue'

const props = defineProps<{
  source: 'local' | 'remote'
  addons?: string[]
  renderTrigger?: object
  displayedState?: object
}>()

const emit = defineEmits(['update:source'])

const isShow = ref(true)

const reRender = () => {
  if (!isShow.value) {
    return
  }

  isShow.value = false

  setTimeout(() => {
    isShow.value = true
  }, 200)
}

const handleChangeSource = (value: 'local' | 'remote') => {
  emit('update:source', value)
}

watch(
  () => props.renderTrigger,
  () => {
    reRender()
  },
  {
    deep: true,
  },
)
</script>

<template>
  <div class="playground-example-block">
    <div class="playground-example-block-top">
      <div class="playground-example-block-title">
        <source-switcher :value="props.source" @input="handleChangeSource" />
        <div
          v-if="props.addons"
          class="playground-example-block-addons"
        >
          <span
            v-for="(item, index) of props.addons"
            :key="index"
            >{{ item }}</span
          >
        </div>
      </div>

      <div class="playground-example-block-actions">
        <button
          @click="reRender"
          class="btn btn-primary"
        >
          force a re-render
        </button>
      </div>
    </div>

    <div class="playground-example-block-control">
      <slot name="control"></slot>
    </div>

    <div ref="contentElement" class="playground-example-block-content">
      <transition name="fade">
        <div v-if="isShow">
          <slot></slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.playground-example-block {
  padding: 30px;
  border-radius: 10px;
  background-color: #fff;
  min-height: 100%;

  &-top {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-content: flex-start;
  }

  &-actions {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  &-control {
    margin: 10px 0 30px;
  }

  &-title {
    font-weight: 600;
    font-size: 14px;
    color: #989898;
    text-transform: uppercase;
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }

  &-addons {
    display: flex;
    align-items: center;
    gap: 5px;

    span {
      padding: 5px 5px 4px 5px;
      border-radius: 5px;
      background-color: #d3d6ef;
      color: #3a46bf;
      font-size: 9px;
      line-height: 1;
    }
  }

  &-content {
    background-color: #fff;
  }

  & + & {
    margin-top: 30px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
