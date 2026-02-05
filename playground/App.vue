<script setup lang="ts">
import PlaygroundHeader from '~/core/header/PlaygroundHeader.vue'
import { useHeader } from '~/core/header/useHeader'
import PlaygroundParams from '~/core/params/PlaygroundParams.vue'
import PlaygroundTable from '~/core/table/PlaygroundTable.vue'

const { headerStyleObject, bodyStyleObject, tableStyleObject, showTableParams } = useHeader()
</script>

<template>
  <div
    class="playground-wrapper"
    :style="bodyStyleObject"
  >
    <div
      class="playground-header"
      :style="headerStyleObject"
    >
      <playground-header />
    </div>

    <div
      class="playground-table"
      :style="tableStyleObject"
    >
      <playground-table />
    </div>

    <div
      v-if="showTableParams"
      class="playground-params"
    >
      <playground-params />
    </div>
  </div>
</template>

<style lang="scss">
.playground-wrapper {
  padding: 10px 30px 30px 30px;
  overflow: hidden;
}

.playground-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  z-index: 1000;
}

.playground-table {
  margin-top: 60px;
}

.playground-params {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100%;
  z-index: 1001;
  background-color: #fff;
  padding: 20px;
  box-shadow: -4px 0px 5px -5px rgba(154, 154, 154, 0.6);
}
</style>
