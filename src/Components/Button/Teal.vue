<script setup>
import Button from '../Button.vue';
</script>

<template>
  <Button class="bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white">
    <slot />
  </Button>
</template>