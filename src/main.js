import { createApp, h } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

import Dashboard from './pages/Dashboard.vue'
import Login from './pages/Auth/Login.vue'

const route = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login },
    { path: '/', component: Dashboard },
  ],
})

const url = window.url = (path = '/') => {
  return 'http://' + `localhost:3333/${path}`.replace(/(\/+)/g, '/').replace(/(.*?)\/$/g, '$1')
}
const app = createApp({
  render: () => h(App, { route }),
})
  .mixin({
    methods: {
      url,
    },
  })
  .use(route)
  .mount('#app')
