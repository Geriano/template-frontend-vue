import { createApp, h } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Store, { store } from './store'
import axios from 'axios'

import Dashboard from './Pages/Dashboard.vue'
import Login from './Pages/Auth/Login.vue'
import Register from './Pages/Auth/Register.vue'
import Profile from './Pages/Auth/Profile.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/profile', component: Profile },
    { path: '/', component: Dashboard },
  ],
})

const url = window.url = (path = '/') => {
  return 'http://' + `localhost:3333/${path}`.replace(/(\/+)/g, '/').replace(/(.*?)\/$/g, '$1')
}

window.router = () => router
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

const app = createApp({
  render: () => h(App, { router }),
})
  .mixin({
    methods: {
      router: window.router,
      url,
    },
  })
  .use(store)
  .use(router)
  .mount('#app')
