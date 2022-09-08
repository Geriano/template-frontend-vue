<script setup>
import Button from '../Button.vue';
</script>

<template>
  <Button class="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white">
    <slot />
  </Button>
</template>