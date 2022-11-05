import './style.css'
import { createApp, h } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Store, { store } from './store'
import axios from 'axios'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

window.axios = axios

const url = window.url = (path = '/') => {
  const SCHEME = import.meta.env.VITE_BACKEND_SCHEME || 'http'
  const HOST = import.meta.env.VITE_BACKEND_HOST || 'localhost:8000'
  
  return `${SCHEME}://` + `${HOST}/${path}`.replace(/(\/+)/g, '/').replace(/(.*?)\/$/g, '$1')
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
