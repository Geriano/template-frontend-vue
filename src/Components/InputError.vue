<script setup>
defineProps({
  error: String,
})
</script>

<template>
  <Transition name="-slide-y">
    <div class="text-red-500 text-sm">
      {{ error }}
    </div>
  </Transition>
</template>