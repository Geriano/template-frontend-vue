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