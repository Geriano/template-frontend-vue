import { createApp, h } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Store, { store } from './store'
import axios from 'axios'

import DashboardLayout from './Layouts/DashboardLayout.vue'
import Dashboard from './Pages/Dashboard.vue'
import Profile from './Pages/Auth/Profile.vue'

import AuthLayout from './Layouts/AuthLayout.vue'
import Login from './Pages/Auth/Login.vue'
import Register from './Pages/Auth/Register.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: DashboardLayout,
      children: [
        { path: '', name: 'dashboard', component: Dashboard, },
        { path: '/profile', name: 'profile', component: Profile },
      ],
    },

    {
      path: '/',
      component: AuthLayout,
      children: [
        { path: '/login', name: 'login', component: Login },
        { path: '/register', name: 'register', component: Register },
      ],
    },
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
