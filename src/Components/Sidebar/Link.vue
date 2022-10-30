<script setup>
const { open, menu, active, pl } = defineProps(['open', 'menu', 'active', 'pl'])
</script>

<template>
  <div>
    <RouterLink :to="{ name: menu.route_or_url }" class="w-full">
      <div
        class="flex items-center space-x-2 hover:bg-gray-700 py-2 transition-all duration-300 text-gray-100"
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
        <div class="flex-none">
          <i :class="menu.icon" />
        </div>
        
        <Transition name="-slide-x">
          <div v-if="open" class="uppercase font-semibold">
            {{ menu.name }}
          </div>
        </Transition>
      </div>
    </RouterLink>
  </div>
</template>