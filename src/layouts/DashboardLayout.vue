<script setup>
import axios from 'axios';
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { store, state } from '../store';
import Menu from '../Components/Sidebar/Menu.vue';

const { user } = defineProps(['user'])
const APP_NAME = import.meta.env.VITE_APP_NAME
const ready = ref(false)
const open = ref({
  sidebar: Boolean(Number(
    localStorage.getItem('show_sidebar')
  )),
  dropdown: false,
})
const menus = ref([])

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
    
    router.push({ name: 'login' })
  } catch (e) {
    store.commit('flash', {
      type: 'error',
      message: `${e}`,
    })
  }
}

const current = useRouter().currentRoute

const getSidebarMenus = async () => {
  try {
    const { data: response } = await axios.get(url(`/menu`))
    menus.value = response
  } catch (e) {
    store.commit('flash', {
      type: 'error',
      message: `${e}`,
    })
  }
}

onMounted(async () => {
  await router.isReady()
  state.user.id || router.push({ name: 'login' })
  await getSidebarMenus()
  ready.value = true
})

const q = e => {
  if (e.key === 'q' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target.hasAttribute('contenteditable'))) {
    e.preventDefault()
    open.value.sidebar = ! open.value.sidebar
  }
}

onMounted(() => document.addEventListener('keyup', q))
onUnmounted(() => document.removeEventListener('keyup', q))
</script>

<template>
  <div class="relative bg-gray-200 dark:bg-gray-900 dark:text-gray-300">
    <div class="flex items-center justify-between w-full h-14 bg-teal-500 px-4 py-2">
      <div class="w-14 h-full"></div>

      <Transition name="-slide-y">
        <div
          v-if="!open.sidebar" 
          class="flex items-center justify-center"
        >
          <h1 class="text-2xl text-white font-bold">
            {{ APP_NAME }}
          </h1>
        </div>
      </Transition>

      <div class="relative w-14 h-full flex items-center justify-center p-2">
        <i 
          @click.prevent="open.dropdown = ! open.dropdown" 
          :class="{ 'text-white -rotate-90': open.dropdown, 'text-gray-100': !open.dropdown }" 
          class="mdi mdi-arrow-left-drop-circle text-2xl transition-all duration-[400ms] cursor-pointer" 
        />

        <Transition name="slide-x">
          <div 
            v-if="open.dropdown" 
            @click.prevent="open.dropdown = false" 
            class="absolute top-10 right-0 w-52 flex flex-col space-y-1 bg-white dark:bg-gray-800 dark:text-gray-200 text-sm border border-gray-300 dark:border-gray-700 rounded shadow-lg z-40 py-2"
          >
            <RouterLink
              :to="{ name: 'profile' }" 
              class="flex items-center space-x-1 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 dark:hover:text-gray-100 transition-all"
            >
              <i class="mdi mdi-account" />
              <div class="lowercase first-letter:capitalize font-semibold">
                profile
              </div>
            </RouterLink>

            <hr class="border-gray-100 dark:border-gray-700 w-[90%] mx-auto">

            <div @click.prevent="logout" class="flex items-center space-x-1 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 dark:hover:text-gray-100 rounded-b-md transition-all cursor-pointer">
              <i class="mdi mdi-logout" /> <div class="lowercase first-letter:capitalize font-semibold">logout</div>
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
      <div class="flex flex-col space-y-4 px-4 py-6">
        <TransitionGroup
          enterActiveClass="transition-all duration-1000"
          enterFromClass="opacity-0"
        >
          <RouterView
            v-if="ready"
            :user="user"
          />
        </TransitionGroup>
      </div>
    </main>

    <div
      :class="{
        'w-96 md:w-64': open.sidebar,
        'w-14': !open.sidebar,
      }"
      class="absolute top-0 left-0 h-screen max-h-screen overflow-y-auto bg-gray-800 transition-all duration-300 z-30 max-w-[100vw]"
    >
      <div class="flex flex-col items-center">
        <div 
          :class="{ 'bg-teal-600': open.sidebar, 'bg-teal-500': !open.sidebar }" 
          class="flex items-center space-x-2 w-full h-14 p-2 transition-all justify-between"
        >
          <TransitionGroup name="-slide-x">
            <button 
              v-if="!open.sidebar" 
              @click.prevent="open.sidebar = ! open.sidebar" class="px-1 rounded mx-auto"
            >
              <i class="mdi mdi-menu text-white text-xl" />
            </button>

            <button 
              v-if="open.sidebar" 
              class="flex-none px-1 rounded mx-auto opacity-0"
            >
              <i class="mdi mdi-menu text-white text-xl" />
            </button>
          
            <div 
              v-if="open.sidebar" 
              class="flex items-center justify-center w-full"
            >
              <p class="text-2xl text-center text-white font-bold">{{ APP_NAME }}</p>
            </div>

            <button 
              v-if="open.sidebar" 
              @click.prevent="open.sidebar = ! open.sidebar" 
              class="flex-none px-1 rounded mx-auto"
            >
              <i class="mdi mdi-menu text-white text-xl" />
            </button>
          </TransitionGroup>
        </div>

        <Menu 
          :open="open.sidebar" 
          :menus="menus" 
          class="h-content py-2" 
        />
      </div>
    </div>
  </div>
</template>

<style src="@vueform/multiselect/themes/default.css"></style>