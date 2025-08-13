<script setup lang="ts">
const props = defineProps({
  checked: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <td class="dt182-cell dt182-cell-selection">
    <div class="dt182-cell-selection-inner">
      <div
        class="dt182-selection-checkbox"
        :class="{ checked: props.checked }"
        @click.stop="handleClick"
      >
        <span v-if="props.checked">&#10004;</span>
      </div>
    </div>
  </td>
</template>
