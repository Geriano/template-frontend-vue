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
    const expired = new Date(expiresAt) - new Date() < 1

    if (expired) {
      store.commit('logout')
      return router.push('/login')
    }

    try {
      const { data: user } = await axios.get(url('user'))
      
      store.commit('login')
    } catch (e) {
      store.commit('logout')
      router.push('/login')
    }
  }

  ready.value = true
})
</script>

<template>
  <div class="bg-gray-300 dark:bg-gray-900 dark:text-gray-300 w-full h-screen">
    <Teleport to="head">
      <link rel="stylesheet" href="/vendors/css/icons.css">
    </Teleport>

    <TransitionGroup name="opacity">
      <RouterView
        v-if="ready"
        :user="state.user"
        :router="router"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.opacity-enter-active, .opacity-leave-active {
  transition: all 300ms ease-in-out;
}

.opacity-enter-from, .opacity-leave-to {
  opacity: 0;
}
</style>