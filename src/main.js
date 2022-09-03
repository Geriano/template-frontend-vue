import { createApp, h } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Store, { store } from './store'

import Dashboard from './Pages/Dashboard.vue'
import Login from './Pages/Auth/Login.vue'
import Register from './Pages/Auth/Register.vue'

const route = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login },
    { path: '/register', component: Register },
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
  .use(store)
  .use(route)
  .mount('#app')
