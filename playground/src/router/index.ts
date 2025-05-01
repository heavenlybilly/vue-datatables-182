import VueRouter, { RouteConfig } from 'vue-router'
import PlaygroundView from '../views/playground/PlaygroundView.vue'

const routes: RouteConfig[] = [
  {
    path: '/',
    redirect: '/playground',
  },
  {
    path: '/playground',
    name: 'playground',
    component: PlaygroundView,
  }
]

const router: VueRouter = new VueRouter({
  routes,
})

export { router }