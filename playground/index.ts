// eslint-disable-next-line import/no-extraneous-dependencies
import { PiniaVuePlugin, createPinia } from 'pinia'
import Vue from 'vue'
import App from '~/App.vue'

const pinia = createPinia()

Vue.use(PiniaVuePlugin)
// Vue.use<DTPluginOptions>(VueDatatables182, {
//   defaultMethod: DTMethod.GET,
// })

new Vue({
  render: (h) => h(App),
  pinia,
}).$mount('#app')
