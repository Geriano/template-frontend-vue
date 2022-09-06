<script setup>
import axios from 'axios';
import { ref, watch, Teleport, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { store, state } from '../store';

const { title } = defineProps({
  title: String,
})

const open = ref({
  sidebar: Boolean(Number(
    localStorage.getItem('show_sidebar')
  )),
  dropdown: false,
})

const router = useRouter()

watch(open.value, () => {
  localStorage.setItem('show_sidebar', Number(open.value.sidebar))
})

const logout = async () => {
  try {
    const { data: response } = await axios.post(url('logout'))
    
    store.commit('logout')
    store.commit('flash', {
      type: 'success',
      message: response.message,
    })
    
    router.push('/login')
  } catch (e) {
    store.commit('flash', {
      type: 'error',
      message: `${e}`,
    })
  }
}

const current = useRouter().currentRoute.value.path

onMounted(() => state.user.id || router.push('/login'))
</script>

<template>
  <div class="relative">
    <Teleport to="head">
      <title class="lowercase first-letter:capitalize">{{ title }}</title>
    </Teleport>

    <div class="flex items-center justify-between w-full h-14 bg-teal-500 px-4 py-2">
      <div class="w-14 h-full"></div>

      <Transition name="-slide-y">
        <div v-if="!open.sidebar" class="flex items-center justify-center">
          <h1 class="text-2xl text-white font-bold">Template</h1>
        </div>
      </Transition>

      <div class="relative w-14 h-full flex items-center justify-center p-2">
        <i @click.prevent="open.dropdown = ! open.dropdown" :class="{ 'text-white -rotate-90': open.dropdown, 'text-gray-100': !open.dropdown }" class="mdi mdi-arrow-left-drop-circle text-2xl transition-all duration-[400ms] cursor-pointer"></i>

        <Transition name="slide-x">
          <div v-if="open.dropdown" class="absolute top-10 right-0 w-52 flex flex-col space-y-1 bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-700 rounded-md shadow z-10">
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
        'md:pl-64': open.sidebar,
      }"
      class="transition-all duration-300 h-content overflow-y-auto"
    >
      <div class="flex flex-col space-y-4 px-6 py-4">
        <slot />
      </div>
    </main>

    <div
      :class="{
        'w-96 md:w-64': open.sidebar,
        'w-14': !open.sidebar,
      }"
      class="absolute top-0 left-0 h-screen max-h-screen overflow-y-auto bg-gray-600 transition-all duration-300"
    >
      <div class="flex flex-col items-center">
        <div :class="{ 'bg-teal-600': open.sidebar, 'bg-teal-500': !open.sidebar }" class="flex items-center space-x-2 w-full h-14 p-2 transition-all">
          <TransitionGroup name="-slide-x">
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

        <div class="flex flex-col w-full h-content overflow-y-auto">
          <RouterLink to="/" class="w-full" title="dashboard">
            <div
              class="flex items-center space-x-2 hover:bg-gray-700 px-4 py-2 transition-all duration-300 text-gray-100"
              :class="{
                'justify-center': !open.sidebar,
                'bg-gray-700': current === '/',
              }"
            >
              <i class="flex-none mdi mdi-view-dashboard"></i>
              
              <Transition name="-slide-x">
                <div v-if="open.sidebar" class="uppercase font-semibold">
                  dashboard
                </div>
              </Transition>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>