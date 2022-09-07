<script setup>
defineProps(['open', 'active', 'to'])
</script>

<template>
  <div>
    <RouterLink :to="to" class="w-full">
      <div
        class="flex items-center space-x-2 hover:bg-gray-700 px-4 py-2 transition-all duration-300 text-gray-100"
        :class="{
          'justify-center': !open,
          'rounded': open,
          'bg-gray-700': active,
        }"
      >
        <div class="flex-none">
          <slot name="icon" />
        </div>
        
        <Transition name="-slide-x">
          <div v-if="open" class="uppercase font-semibold">
            <slot name="body" />
          </div>
        </Transition>
      </div>
    </RouterLink>
  </div>
</template>