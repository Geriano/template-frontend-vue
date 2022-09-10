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
