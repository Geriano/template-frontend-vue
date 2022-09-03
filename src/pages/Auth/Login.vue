<script setup>
import { ref } from 'vue';
import AuthLayout from '../../Layouts/AuthLayout.vue';

const processing = ref(false)
const hidden = ref(true)
const username = ref(null)
const password = ref(null)
const form = ref({
  username: '',
  password: '',
})
const errors = ref({
  username: '',
  password: '',
})

const submit = async () => {
  console.log(form.value.username, form.value.password)
}
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
            <label for="username" class="lowercase first-letter:capitalize font-semibold">
              username
            </label>

            <div class="flex flex-col space-y-1">
              <div class="relative w-full">
                <div class="absolute top-0 left-0 h-full flex items-center bg-gray-600 rounded-l px-2">
                  <i class="mdi mdi-at text-xl"></i>
                </div>
                <input
                  v-model="form.username"
                  ref="username"
                  type="text"
                  placeholder="username"
                  class="bg-transparent w-full rounded focus:outline-none focus:ring ring-teal-500 border dark:border-gray-600 pl-12 py-1 transition-all"
                  required
                  autofocus
                >
              </div>

              <Transition name="-slide-y">
                <div v-if="errors.username" class="text-sm text-right text-red-400 lowercase">
                  {{ errors.username }}
                </div>
              </Transition>
            </div>

            <label for="password" class="lowercase first-letter:capitalize font-semibold">
              password
            </label>

            <div class="flex flex-col space-y-1">
              <div class="relative w-full">
                <div @click.prevent="hidden = ! hidden" class="absolute top-0 left-0 h-full flex items-center bg-gray-600 rounded-l px-2 cursor-pointer">
                  <i class="mdi mdi-form-textbox-password text-xl transition-all duration-300" :class="!hidden && 'rotate-180'"></i>
                </div>
                <input
                  v-model="form.password"
                  ref="password"
                  :type="hidden ? 'password' : 'text'"
                  placeholder="password"
                  class="bg-transparent w-full rounded focus:outline-none focus:ring ring-teal-500 border dark:border-gray-600 pl-12 py-1 transition-all"
                  required
                  autofocus
                >
              </div>

              <Transition name="-slide-y">
                <div v-if="errors.password" class="text-sm text-right text-red-400 lowercase">
                  {{ errors.password }}
                </div>
              </Transition>
            </div>
          </div>

          <div class="flex items-center justify-between p-2">
            <RouterLink to="/register" class="text-sm lowercase first-letter:capitalize">not have account?</RouterLink>

            <button
              :disabled="processing"
              :class="{
                'bg-teal-700': processing,
                'bg-gradient-to-tr hover:bg-gradient-to-br from-teal-500 to-teal-600': !processing,
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