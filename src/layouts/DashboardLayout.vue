<script setup>
import axios from 'axios';
import { ref, watch, Teleport, onMounted } from 'vue';
import { store, state } from '../store';

const { title } = defineProps({
  title: String,
})

const open = ref({
  sidebar: Boolean(Number(
    localStorage.getItem('show_sidebar')
  )),
  dropdown: Boolean(Number(
    localStorage.getItem('show_dropdown')
  )),
})

watch(open, () => {
  localStorage.setItem('show_sidebar', Number(open.value.sidebar))
  localStorage.setItem('show_dropdown', Number(open.value.dropdown))
})

const logout = async () => {
  try {
    const { data: response } = await axios.post(url('logout'))
    
    store.commit('logout')
    
    router().push('/login')
  } catch (e) {
    console.log('logout error', e)
  }
}

onMounted(() => state.user.id || router().push('/login'))
</script>
  
<style scoped>
  main {
  height: calc(100vh - 3.5rem);
}

.slide-y-enter-active, .slide-y-leave-active {
  transition: all 300ms ease-in-out;
}

.slide-y-enter-from, .slide-y-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}


.slide-x-enter-active, .slide-x-leave-active {
  transition: all;
  transition-timing-function: ease-in-out;
}

.slide-x-enter-from, .slide-x-leave-to {
  transition-duration: 50ms;
  transform: translateX(-100%);
  opacity: 0;
}

.slide-x-enter-to, .slide-x-leave-from {
  transition-duration: 200ms;
}

.dropdown-enter-active, .dropdown-leave-active {
  transition: all 300ms ease-in-out;
}

.dropdown-enter-from, .dropdown-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>

<template>
  <div class="relative">
    <Teleport to="head">
      <title class="lowercase first-letter:capitalize">{{ title }}</title>
    </Teleport>

    <div class="flex items-center justify-between w-full h-14 bg-teal-500 px-4 py-2">
      <div class="w-14 h-full"></div>

      <Transition name="slide-y">
        <div v-if="!open.sidebar" class="flex items-center justify-center">
          <h1 class="text-2xl text-white font-bold">Template</h1>
        </div>
      </Transition>

      <div class="relative w-14 h-full flex items-center justify-center p-2">
        <i @click.prevent="open.dropdown = ! open.dropdown" :class="{ 'text-white -rotate-90': open.dropdown, 'text-gray-100': !open.dropdown }" class="mdi mdi-arrow-left-drop-circle text-2xl transition-all duration-[400ms] cursor-pointer"></i>

        <Transition name="dropdown">
          <div v-if="open.dropdown" class="absolute top-10 right-0 w-52 flex flex-col space-y-1 bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-700 rounded-md shadow">
            <div class="border-b border-gray-100 dark:border-gray-500 mx-2 mt-2"></div>
            <RouterLink to="profile" class="flex items-center space-x-1 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 dark:hover:text-gray-100 rounded transition-all">
              <i class="mdi mdi-face-man"></i> <div class="lowercase first-letter:capitalize font-semibold">profile</div>
            </RouterLink>
            <div class="border-b border-gray-100 dark:border-gray-500 mx-2 mt-2"></div>
            <div @click.prevent="logout" class="flex items-center space-x-1 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 dark:hover:text-gray-100 rounded rounded-b-md transition-all cursor-pointer">
              <i class="mdi mdi-logout"></i> <div class="lowercase first-letter:capitalize font-semibold">logout</div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <main
      :class="{
        'pl-14': !open.sidebar,
        'pl-64': open.sidebar,
      }"
      class="transition-all duration-300 overflow-y-auto"
    >
      <div class="flex flex-col space-y-4 px-6 py-4">
        <slot />
      </div>
    </main>

    <div
      :class="{
        'w-64': open.sidebar,
        'w-14': !open.sidebar,
      }"
      class="absolute top-0 left-0 h-screen max-h-screen overflow-y-auto bg-gray-600 transition-all duration-300"
    >
      <div class="flex flex-col items-center">
        <div :class="{ 'bg-teal-600': open.sidebar, 'bg-teal-500': !open.sidebar }" class="flex items-center space-x-2 w-full h-14 p-2 transition-all">
          <TransitionGroup name="slide-x">
            <button v-if="!open.sidebar" @click.prevent="open.sidebar = ! open.sidebar" class="px-1 rounded-md mx-auto">
              <i class="mdi mdi-menu text-white text-xl"></i>
            </button>
          
            <div v-if="open.sidebar" class="flex items-center justify-center w-full">
              <p class="text-2xl text-center text-white font-bold">Template</p>
            </div>

            <button v-if="open.sidebar" @click.prevent="open.sidebar = ! open.sidebar" class="px-1 rounded-md mx-auto">
              <i class="mdi mdi-menu text-white text-xl"></i>
            </button>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>