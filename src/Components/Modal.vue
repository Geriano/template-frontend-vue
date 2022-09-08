<script setup>
import { onMounted, onUpdated, ref, Teleport } from 'vue';

const { open } = defineProps({
  open: Boolean,
})

const close = () => console.log('closed')
</script>

<template>
  <Teleport to="body">
    <Transition
      enterActiveClass="transition-all duration-300"
      leaveActiveClass="transition-all duration-300"
      enterFromClass="opacity-0"
      leaveToClass="opacity-0"
    >
      <div v-if="open" class="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black bg-opacity-40 backdrop-blur p-2 sm:p-8 md:p-12 lg:p-16 z-30 dark:text-gray-200 transition-all">
        <div class="w-full h-full max-h-modal-content overflow-y-auto rounded">
            <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.max-h-modal-content {
  max-height: calc(100vh - 1rem) !important;
}

@media (min-width: 640px) {
  .max-h-modal-content {
    max-height: calc(100vh - 4rem) !important;
  }
}

@media (min-width: 768px) {
  .max-h-modal-content {
    max-height: calc(100vh - 6rem) !important;
  }
}

@media (min-width: 1024px) {
  .max-h-modal-content {
    max-height: calc(100vh - 8rem) !important;
  }
}
</style>