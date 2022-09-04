<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import FormData from '../../form'
import AuthLayout from '../../Layouts/AuthLayout.vue';
import Store, { state } from '../../store'

const { router } = defineProps(['router'])

const hidden = ref(true)
const error = ref(null)
const success = ref(null)
const form = new FormData({
  username: '',
  password: '',
})

const setToken = token => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  state.token = token
}

const getUser = async () => {
  try {
    const { status, data: user } = await axios.get(url('user'))

    state.user.id = user.id
    state.user.name = user.name
    state.user.username = user.username
    state.user.email = user.email
    state.user.permissions = user.permissions
    state.user.roles = user.roles

    router.push('/')
  } catch (e) {
    console.log('error when getting user', e)
  }
}

const submit = async () => {
  try {
    const { status, data } = await form.post(url('login'))

    if (status === 422) {
      form.reset('password')
    } else {
      const { message, token, expired_at } = data
      success.value = message
      localStorage.setItem('authorization', JSON.stringify({
        token, expired_at,
      }))
      
      setToken(token)
      
      await getUser()
    }
  } catch (e) {
    const { response } = e
    const { status, data } = response

    if (status === 401) {
      error.value = data
    }
  }
}

onMounted(() => state.user.id && router.back())
</script>

<template>
  <AuthLayout>
    <div class="flex flex-col lg:flex-row items-center justify-evenly w-full h-full p-4 bg-gray-800 rounded-md">
      <div class="hidden lg:block lg:w-1/3">
        <h1 class="text-5xl font-bold text-gray-100 lowercase first-letter:capitalize">
          coding every time, every where
        </h1>
      </div>

      <div class="w-full max-w-sm lg:w-1/3">
        <form @submit.prevent="submit" class="flex flex-col space-y-2 w-full bg-gray-700 rounded-md border-r-8 border-teal-500 border-solid shadow-md">
          <div class="flex flex-col space-y-2 px-6 py-4">
            <TransitionGroup name="-slide-y">
              <div v-if="error" class="bg-red-500 text-center text-white font-semibold rounded-md p-4 bg-opacity-90 lowercase first-letter:capitalize">
                {{ error }}
              </div>

              <div v-if="success" class="bg-green-500 text-center text-white font-semibold rounded-md p-4 bg-opacity-90 lowercase first-letter:capitalize">
                {{ success }}
              </div>
            </TransitionGroup>

            <label for="username" class="lowercase first-letter:capitalize font-semibold">
              username
            </label>

            <div class="flex flex-col space-y-1">
              <div class="relative w-full">
                <div
                  class="absolute top-0 left-0 h-full flex items-center dark:bg-gray-600 rounded-l px-2"
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
                  class="absolute top-0 left-0 h-full flex items-center dark:bg-gray-600 rounded-l px-2 cursor-pointer"
                  :class="{ 'bg-red-500 dark:bg-red-500': form.errors.password }"
                >
                  <i class="mdi mdi-form-textbox-password text-xl transition-all duration-300" :class="!hidden && 'rotate-180'"></i>
                </div>
                <input
                  v-model="form.password"
                  :type="hidden ? 'password' : 'text'"
                  placeholder="password"
                  class="bg-transparent w-full rounded focus:outline-none focus:ring ring-teal-500 border dark:border-gray-600 pl-12 py-1 transition-all"
                  :class="{ 'ring-1 ring-red-500 border-red-500 dark:border-red-500': form.errors.password }"
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
              <div class="flex items-center space-x-1">
                <i class="mdi mdi-check"></i>
                <p class="uppercase font-semibold">
                  login
                </p>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  </AuthLayout>
</template>