<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import FormData from '../../form'
import Store, { store, state } from '../../store'

const router = useRouter()

const hidden = ref(true)
const error = ref(null)
const success = ref(null)
const form = new FormData({
  username: '',
  password: '',
})

const setToken = (token, expiresAt) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  state.token = token
  localStorage.setItem('authorization', JSON.stringify({ token, expiresAt }))
}

const submit = async () => {
  try {
    const { status, data } = await form.post(url('login'))

    if (status === 422) {
      form.reset('password')
    } else {
      const { message, token, expiresAt } = data
      store.commit('flash', {
        type: 'success',
        message,
      })
      setToken(token, expiresAt)
      router.push('/')
    }
  } catch (e) {
    const { response } = e
    const { status, data: message } = response
    
    store.commit('flash', {
      type: 'error',
      message,
    })
  }
}
</script>

<template>
  <div class="flex flex-col lg:flex-row items-center justify-around w-full h-full p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
    <div class="hidden lg:block lg:w-1/3">
      <h1 class="text-5xl font-bold text-gray-800 dark:text-gray-100 lowercase first-letter:capitalize">
        coding every time, every where
      </h1>
    </div>

    <div class="w-full max-w-xl lg:max-w-md">
      <form @submit.prevent="submit" class="flex flex-col space-y-2 w-full bg-white dark:bg-gray-700 rounded-md border-l-8 border-teal-500 border-solid shadow-md">
        <div class="flex flex-col space-y-2 px-6 py-4">
          <label for="username" class="lowercase first-letter:capitalize font-semibold">
            username
          </label>

          <div class="flex flex-col space-y-1">
            <div class="relative w-full">
              <div
                class="absolute top-0 left-0 h-full flex items-center bg-gray-200 dark:bg-gray-600 rounded-l px-2"
                :class="{ 'bg-red-500 dark:bg-red-500': form.errors.username }"
              >
                <i class="mdi mdi-at text-xl"></i>
              </div>

              <input
                v-model="form.username"
                type="text"
                placeholder="username"
                class="bg-transparent w-full rounded focus:outline-none focus:ring ring-teal-500 border dark:border-gray-600 pl-12 py-1 transition-all"
                :class="{ 'ring-1 ring-red-500 border-red-500 dark:border-red-500': form.errors.username }"
                required
                autofocus
              >
            </div>

            <Transition name="-slide-y">
              <div v-if="form.errors.username" class="text-sm text-right text-red-400 lowercase">
                {{ form.errors.username }}
              </div>
            </Transition>
          </div>

          <label for="password" class="lowercase first-letter:capitalize font-semibold">
            password
          </label>

          <div class="flex flex-col space-y-1">
            <div class="relative w-full">
              <div
                @click.prevent="hidden = ! hidden"
                class="absolute top-0 left-0 h-full flex items-center bg-gray-200 dark:bg-gray-600 rounded-l px-2 cursor-pointer"
                :class="{
                  'bg-red-500 dark:bg-red-500': form.errors.password,
                  'bg-orange-500 dark:bg-orange-500': !hidden,
                }"
              >
                <i class="mdi mdi-form-textbox-password text-xl transition-all duration-300" :class="!hidden && 'rotate-180'"></i>
              </div>
              <input
                v-model="form.password"
                :type="hidden ? 'password' : 'text'"
                placeholder="password"
                class="bg-transparent w-full border rounded focus:outline-none focus:ring pl-12 py-1 transition-all"
                :class="{
                  'ring-1 ring-red-500 border-red-500 dark:border-red-500': form.errors.password,
                  'ring-1 ring-orange-500 border-orange-500 dark:border-orange-500': !hidden,
                  'ring-teal-500 dark:border-gray-600': hidden,
                }"
                required
                autofocus
              >
            </div>

            <Transition name="-slide-y">
              <div v-if="form.errors.password" class="text-sm text-right text-red-400 lowercase">
                {{ form.errors.password }}
              </div>
            </Transition>
          </div>
        </div>

        <div class="flex items-center justify-between p-2">
          <RouterLink to="/register" class="text-sm lowercase first-letter:capitalize">not have account?</RouterLink>

          <button
            :disabled="form.processing"
            :class="{
              'bg-teal-700': form.processing,
              'bg-gradient-to-tr hover:bg-gradient-to-br from-teal-500 to-teal-600': !form.processing,
            }"
            class="px-3 py-1 rounded text-sm transition-all"
            type="submit"
          >
            <div class="flex items-center space-x-1 text-gray-50">
              <i
                :class="{
                  'mdi-loading animate-spin': form.processing,
                  'mdi-check': !form.processing,
                }"
                class="mdi transition-all"
              />
              <p class="uppercase font-semibold">
                login
              </p>
            </div>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>