<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  expanded: boolean
}>()

const emit = defineEmits(['update:expanded'])

const classObject = computed(() => ({
  expanded: props.expanded,
}))

const handleExpand = () => {
  emit('update:expanded', !props.expanded)
}
</script>

<template>
  <div
    class="playground-control-group"
    :class="classObject"
  >
    <div
      class="playground-control-group-title"
      :class="classObject"
      @click="handleExpand"
    >
      {{ props.title }}
    </div>

    <div
      v-if="expanded"
      class="playground-control-group-content"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.playground-control-group {
  position: relative;
  display: block;
  background-color: #fff;
  border: 1px solid transparent;
  transition: border 200ms ease-in-out;

  &.expanded {
    border-top: 1px solid #dedef4;
  }

  &-title {
    position: absolute;
    top: -6px;
    left: 0;
    background-color: inherit;
    font-size: 10px;
    text-transform: uppercase;
    color: #989898;
    font-weight: 600;
    display: inline-block;
    cursor: pointer;
    transition: color 0.15s ease-in-out;
    user-select: none;
    padding-right: 5px;

    &:hover {
      color: #4848ca;
    }

    &.expanded {
      color: #4848ca;
    }
  }

  &-content {
    padding: 20px 15px 15px 0;
  }

  & + & {
    margin-top: 25px;
  }
}
</style>
