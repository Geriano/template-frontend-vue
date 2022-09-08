<script setup>
import Button from '../Button.vue';
</script>

<template>
  <Button class="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white">
    <slot />
  </Button>
</template>