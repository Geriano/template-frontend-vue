<script setup>
import axios from 'axios';
import { onMounted, Teleport, ref } from 'vue';
import { useRouter } from 'vue-router';
import { state, store } from './store';

const router = useRouter()
const ready = ref(false)

onMounted(async () => {
  await router.isReady()

  const authorization = localStorage.getItem('authorization')

  if (authorization) {
    const { token, expiresAt } = JSON.parse(authorization)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    state.token = token
    const expired = (new Date(expiresAt) - new Date()) < 1

    if (expired) {
      store.commit('logout')
      return router.push({ name: 'login' })
    }

    try {
      const { data: user } = await axios.get(url('user'))
      
      store.commit('login', user)
    } catch (e) {
      store.commit('logout')
      router.push({ name: 'login' })
    }
  }

  ready.value = true
})
</script>

<template>
  <div class="bg-gray-100 dark:bg-gray-900 dark:text-gray-300 w-full h-screen">
    <Teleport to="head">
      <link rel="stylesheet" href="/vendors/css/icons.css">
    </Teleport>

    <Transition
      enterActiveClass="transition-all"
      leaveActiveClass="transition-all"
      enterFromClass="opacity-0"
      leaveToClass="opacity-0"
    >
      <RouterView
        v-if="ready"
        :user="state.user"
      />

      <div v-else class="fixed top-0 left-0 flex items-center justify-center w-full h-screen backdrop-blur-md bg-black bg-opacity-20 z-10 duration-700">
        <i class="mdi mdi-loading text-[15rem] text-teal-500 font-bold animate-spin"></i>
      </div>
    </Transition>

    <Transition name="flash">
      <template v-if="Object.values(state.flash).length">
        <div class="fixed top-6 right-0 w-full max-w-sm max-h-96 overflow-y-auto flex flex-col space-y-2 p-4 z-20">
          <TransitionGroup name="-slide-y">
            <div
              v-for="(f, i) in state.flash" :key="i"
              :class="{
                'border-red-500': f.type === 'error',
                'border-green-500': f.type === 'success',
                'border-cyan-500': f.type === 'info',
                'border-orange-500': f.type === 'warning',
              }"
              class="flex items-center space-x-2 p-2 rounded border-l-8 border-solid bg-white dark:bg-gray-800 shadow-lg"
            >
              <div class="w-full">
                <p class="lowercase first-letter:capitalize">
                  {{ f.message }}
                </p>
              </div>

              <i
                @click.prevent="delete(state.flash[i])"
                class="bx bx-x flex-none bg-red-500 text-white rounded-md p-1 cursor-pointer"
              />
            </div>
          </TransitionGroup>
        </div>
      </template>
    </Transition>
  </div>
</template>

<style scoped>
.flash-enter-active, .flash-leave-active {
  transition: all 400ms ease-in-out;
}

.flash-enter-active {
  transition-duration: 50ms;
}

.flash-enter-from, .flash-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>