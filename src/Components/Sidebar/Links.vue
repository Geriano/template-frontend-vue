<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"
import Link from './Link.vue'

defineProps(['open', 'active', 'text'])

const router = useRouter()
const current = router.currentRoute

const show = ref(false)
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
          <slot name="icon" />
        </div>
        
        <TransitionGroup name="-slide-x">
          <template v-if="open">
            <div class="uppercase font-semibold w-full text-left">
              {{ text }}
            </div>

            <i class="flex-none text-xl mdi mdi-menu-down transition-all" :class="!show && 'rotate-90'"></i>
          </template>
        </TransitionGroup>
      </div>
    </button>

    <Transition name="-slide-x">
      <div v-if="show && open" class="flex flex-col space-y-2 pl-6">
        <slot name="childs" />
      </div>
    </Transition>
  </div>
</template>