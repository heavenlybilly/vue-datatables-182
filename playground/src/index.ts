import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import { router } from './router'
import './scss/index.scss'
import { VueDatatables182 } from '../../src/index'

// @ts-ignore
window.remoteUrl = import.meta.env.VITE_REMOTE_URL

Vue.use(VueRouter)
Vue.use(VueDatatables182, {
  defaultMethod: 'GET',
})

new Vue({
  render: (h) => h(App),
  router,
}).$mount('#app')
