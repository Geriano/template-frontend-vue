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