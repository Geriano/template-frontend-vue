<script setup>
import axios from 'axios'
import { onMounted } from 'vue'
import store, { state } from '../store'

onMounted(() => state.user.id && router().back())
onMounted(async () => {
  const authorization = localStorage.getItem('authorization')

  if (authorization) {
    const { token } = JSON.parse(authorization)

    try {
      const { data: user } = await axios.get(url('user'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      store.commit('login', user)
      router().push('/')
    } catch (e) {
      store.commit('flash', {
        type: 'error',
        message: `${e}`,
      })
    }
  }
})
</script>

<template>
  <div class="flex items-center justify-center w-full h-screen px-4 py-2 sm:px-6 sm:py-4 md:px-10 md:py-6 lg:px-16 lg:py-10 xl:px-28 xl:py-16 transition-all duration-700">
    <slot />
  </div>
</template>