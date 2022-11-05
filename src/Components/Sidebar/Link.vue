<script setup>
import { useRouter } from "vue-router"

const router = useRouter()
const { open, menu, active, pl } = defineProps(['open', 'menu', 'active', 'pl'])
</script>

<template>
  <div
    class="text-sm"
    :class="{
      'border-b border-gray-700': !menu.parent_id,
    }"
  >
    <RouterLink :to="router.hasRoute(menu.route_or_url) ? { name: menu.route_or_url } : menu.route_or_url" class="w-full">
      <div
        class="flex items-center space-x-2 hover:bg-gray-700 text-gray-200 py-2 transition-all duration-300"
        :class="{
          'justify-center': !open,
          'rounded': open,
          'bg-gray-700': active,
          'px-4': !pl,
          'pl-8': pl === 1,
          'pl-16': pl === 2,
          'pl-20': pl === 3,
          'pl-28': pl === 4,
          'pl-36': pl === 5,
        }"
      >
        <div class="flex-none text-gray-400">
          <i :class="menu.icon" />
        </div>
        
        <Transition name="-slide-x">
          <div v-if="open" class="capitalize font-semibold">
            {{ menu.name }}
          </div>
        </Transition>
      </div>
    </RouterLink>
  </div>
</template>