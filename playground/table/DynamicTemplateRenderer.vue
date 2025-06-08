<script setup lang="ts">
import Vue, { CreateElement, VNode, getCurrentInstance, onBeforeMount } from 'vue'

const props = defineProps<{
  template: string
  scope?: Record<string, any>
}>()

const display = false

let compiledRender: (createElement: CreateElement) => VNode
let staticRenderFns: ((createElement: CreateElement) => VNode)[] = []

onBeforeMount(() => {
  const template = props.template.trim()
  const wrappedTemplate = /^<.*>$/.test(template) ? template : `<div>${template}</div>`

  const compiled = Vue.compile(wrappedTemplate)
  compiledRender = compiled.render
  staticRenderFns = compiled.staticRenderFns
})

const instance = getCurrentInstance()
if (instance) {
  const vm = { ...instance.proxy } as Vue

  // eslint-disable-next-line func-names
  vm.$options.render = function (h: any) {
    if (props.scope) {
      Object.assign(this, props.scope)
    }
    return compiledRender.call(this, h)
  }

  vm.$options.staticRenderFns = staticRenderFns
}
</script>

<template>
  <div v-if="display"></div>
</template>
