<script setup>
import { ref } from "vue";
import Link from './Link.vue'

const { active, open, menu } = defineProps(['open', 'menu', 'active'])

const show = ref(open && active)
</script>

<template>
  <div class="flex flex-col space-y-2 border-y border-gray-500 py-1" :class="!open && 'py-0 border-y-0'">
    <button @click.prevent="show = ! show" class="w-full">
      <div
        class="flex items-center space-x-2 hover:bg-gray-700 px-4 py-2 transition-all duration-300 text-gray-100"
        :class="{
          'justify-center': !open,
          'rounded': open,
          'bg-gray-700': show && open,
        }"
      >
        <div class="flex-none">
          <i :class="menu.icon" />
        </div>
        
        <TransitionGroup name="-slide-x">
          <template v-if="open">
            <div class="uppercase font-semibold w-full text-left">
              {{ menu.name }}
            </div>

            <i class="flex-none text-xl mdi mdi-menu-down transition-all" :class="!show && 'rotate-90'"></i>
          </template>
        </TransitionGroup>
      </div>
    </button>

    <Transition name="-slide-x">
      <div v-if="show && open" @click.prevent="click" class="flex flex-col space-y-2 pl-6">
        <slot />
      </div>
    </Transition>
  </div>
</template>