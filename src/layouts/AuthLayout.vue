<script setup>
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import store, { state } from '../store'

const { user } = defineProps(['user'])
const router = useRouter()
const ready = ref(false)

onMounted(async () => {
  await router.isReady()
  axios.defaults.headers.common['Content-Type'] = 'application/json'
  const authorization = localStorage.getItem('authorization')

  if (state.user.id) {
    store.commit('flash', {
      type: 'info',
      message: 'you has been authenticated',
    })

    return router.push({ name: 'home' })
  }

  if (authorization) {
    const { token } = JSON.parse(authorization)

    try {
      const { data: user } = await axios.get(url('user'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      store.commit('login', user)
      router.push({ name: 'home' })
    } catch (e) {
      // 
    }
  }

  ready.value = true
})
</script>

<template>
  <div class="flex items-center justify-center w-full h-screen px-4 py-2 sm:px-6 sm:py-4 md:px-10 md:py-6 lg:px-16 lg:py-10 xl:px-28 xl:py-16 transition-all duration-700 dark:bg-gray-900 dark:text-gray-300 font-sans">
    <Transition
      enterActiveClass="transition-all"
      leaveActiveClass="transition-all"
      enterFromClass="opacity-0 -translate-y-full"
      leaveToClass="opacity-0 -translate-y-full"
    >
      <RouterView
        v-if="ready"
      />
    </Transition>
  </div>
</template>