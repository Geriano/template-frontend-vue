<script setup>
import { ref } from "vue";
import Link from './Link.vue'

const { active, open, menu, pl } = defineProps(['open', 'menu', 'active', 'pl'])

const show = ref(open && active)
</script>

<template>
  <div
    class="flex flex-col space-y-2 py-1 text-sm"
    :class="{
      'py-0 border-y-0': !open,
      'border-b border-gray-700': !menu.parent_id,
    }"
  >
    <button @click.prevent="show = ! show" class="w-full">
      <div
        class="flex items-center space-x-2 hover:bg-gray-700 px-4 py-2 transition-all duration-300 text-gray-200"
        :class="{
          'justify-center': !open,
          'rounded': open,
          'bg-gray-700': show && open,
          'px-4': !pl,
          'pl-8 pr-4': pl === 1,
          'pl-16 pr-4': pl === 2,
          'pl-20 pr-4': pl === 3,
          'pl-28 pr-4': pl === 4,
          'pl-36 pr-4': pl === 5,
        }"
      >
        <div class="flex-none text-gray-400">
          <i :class="menu.icon" />
        </div>
        
        <TransitionGroup name="-slide-x">
          <template v-if="open">
            <div class="capitalize font-semibold w-full text-left">
              {{ menu.name }}
            </div>

            <i class="flex-none text-md mdi mdi-menu-down transition-all" :class="!show && 'rotate-90'" />
          </template>
        </TransitionGroup>
      </div>
    </button>

    <Transition name="-slide-x">
      <div v-if="show && open" @click.prevent="click" class="flex flex-col space-y-2">
        <slot />
      </div>
    </Transition>
  </div>
</template>