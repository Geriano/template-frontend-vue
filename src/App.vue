<script setup>
import axios from 'axios';
import { onMounted, Teleport, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const ready = ref(false)

onMounted(async () => {
  await router.isReady()
  ready.value = true
})
</script>

<template>
  <div class="bg-gray-300 dark:bg-gray-900 dark:text-gray-300 w-full h-screen">
    <Teleport to="head">
      <link rel="stylesheet" href="/vendors/css/icons.css">
    </Teleport>

    <TransitionGroup name="opacity">
      <RouterView v-if="ready" :user="user" :router="router" />
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