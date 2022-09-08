<script setup>
import Button from '../Button.vue';
</script>

<template>
  <Button class="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white">
    <slot />
  </Button>
</template>