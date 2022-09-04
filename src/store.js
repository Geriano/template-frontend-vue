import axios from 'axios'
import { createStore } from 'vuex'

export const store = createStore({
  state: {
    user: {
      id: 0,
      name: '',
      username: '',
      email: '',
      permissions: [],
      roles: [],
    },
    token: '',
    flash: {},
  },

  mutations: {
    login: (state, { id, name, username, email, permissions, roles }) => {
      state.user.id = id
      state.user.name = name
      state.user.username = username
      state.user.email = email
      state.user.permissions = permissions
      state.user.roles = roles
    },

    logout: state => {
      state.user.id = state.user.name = state.user.username = state.user.email = null
      state.user.permissions = state.user.roles = []

      localStorage.removeItem('authorization')
    },

    flash: (state, { type, message }) => {
      const id = Object.values(state.flash).length
      state.flash[id] = { type, message }

      setTimeout(() => {
        delete(state.flash[id]);
      }, 3000)
    }
  },

  actions: {
    relog: async state => {
      try {
        const { data: user } = await axios.get(url('user'))
        store.commit('login', user)
      } catch (e) {
        store.flash('flash', {
          type: 'error',
          message: `${e}`,
        })
      }
    }
  },
})

export const getters = store.getters
export const state = store.state
export const commit = store.commit
export const dispatch = store.dispatch

export default {
  getters,
  state,
  commit,
  dispatch,
}