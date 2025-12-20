<script setup lang="ts">
import { useMessages } from '../../../localization/use-messages'

const messages = useMessages()
</script>

<template>
  <div
    :aria-label="messages.numbering"
    class="dt182-column dt182-column-numbering"
    role="columnheader"
  >
    <div class="dt182-column-numbering-inner">#</div>
  </div>
</template>

<style lang="scss">
.dt182-column-numbering {
  padding-right: 0;
  padding-left: 0;
  background-color: var(--dt182-header-background, #f3f5f8);

  &-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}
</style>
