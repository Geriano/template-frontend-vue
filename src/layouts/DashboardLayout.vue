<script setup>
import axios from 'axios';
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { store, state } from '../store';
import Menu from '../Components/Sidebar/Menu.vue';

const { user } = defineProps(['user'])

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
    const { data: response } = await axios.get(url(`/superuser/menu`))
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
  if (e.key === 'q' && !(e.target instanceof HTMLInputElement)) {
    e.preventDefault()
    open.value.sidebar = ! open.value.sidebar
  }
}

onMounted(() => document.addEventListener('keyup', q))
onUnmounted(() => document.removeEventListener('keyup', q))
</script>

<template>
  <div class="relative">
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
          <div v-if="open.dropdown" @click.prevent="open.dropdown = false" class="absolute top-10 right-0 w-52 flex flex-col space-y-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-700 rounded-md shadow z-40">
            <div class="border-b border-gray-100 dark:border-gray-500 mx-2 mt-2"></div>
            <RouterLink :to="{ name: 'profile' }" class="flex items-center space-x-1 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 dark:hover:text-gray-100 rounded transition-all">
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
      class="absolute top-0 left-0 h-screen max-h-screen overflow-y-auto bg-gray-600 transition-all duration-300 z-30"
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

        <Menu :open="open.sidebar" :menus="menus" class="h-content" />

        <div v-if="false" class="flex flex-col w-full h-content overflow-y-auto" :class="open.sidebar && 'p-2 space-y-2'">
          <Link
            :to="{ name: 'home' }"
            :open="open.sidebar"
            :active="current.name === 'home'"
          >
            <template #icon>
              <i class="mdi mdi-view-dashboard" />
            </template>

            <template #body>
              dashboard
            </template>
          </Link>

          <Links
            :open="open.sidebar"
            :active="[
              'superuser.permission',
              'superuser.role',
              'superuser.user',
              'superuser.menu',
            ].includes(current.name)"
            text="builtin"
          >
            <template #icon>
              <i class="mdi mdi-circle" />
            </template>

            <template #childs>
              <Link
                :to="{ name: 'superuser.permission' }"
                :open="open.sidebar"
                :active="current.name === 'superuser.permission'"
              >
                <template #icon>
                  <i class="mdi mdi-account-key" />
                </template>

                <template #body>
                  permission
                </template>
              </Link>

              <Link
                :to="{ name: 'superuser.role' }"
                :open="open.sidebar"
                :active="current.name === 'superuser.role'"
              >
                <template #icon>
                  <i class="mdi mdi-account-settings" />
                </template>

                <template #body>
                  role
                </template>
              </Link>

              <Link
                :to="{ name: 'superuser.user' }"
                :open="open.sidebar"
                :active="current.name === 'superuser.user'"
              >
                <template #icon>
                  <i class="mdi mdi-account-group" />
                </template>

                <template #body>
                  user
                </template>
              </Link>

              <Link
                :to="{ name: 'superuser.menu' }"
                :open="open.sidebar"
                :active="current.name === 'superuser.menu'"
              >
                <template #icon>
                  <i class="mdi mdi-menu" />
                </template>

                <template #body>
                  menu
                </template>
              </Link>
            </template>
          </Links>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@vueform/multiselect/themes/default.css"></style>