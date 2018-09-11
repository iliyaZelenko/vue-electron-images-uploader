import Vue from 'vue'
import Router from 'vue-router'
import Layout from './layouts/Main.vue'
import LayoutTray from './layouts/Tray.vue'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  // mode: 'history', НЕ ИСПОЛЬЗОВАТЬ!!!!
  base: process.env.BASE_URL,
  routes: [
    {
      component: Layout,
      path: '/',
      children: [
        {
          path: '/',
          name: 'home',
          component: Home
        },
        {
          path: '/file',
          name: 'file',
          component: () => import(/* webpackChunkName: "file" */ './views/File.vue')
        },
        {
          path: '/about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
        }
      ]
    },
    {
      component: LayoutTray,
      path: '/',
      children: [
        {
          path: '/file-tray',
          name: 'file-from-tray',
          component: () => import(/* webpackChunkName: "file-tray" */ './views/File.vue')
        }
      ]
    }
  ]
})
