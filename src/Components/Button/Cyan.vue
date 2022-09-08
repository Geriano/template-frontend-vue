<script setup>
import Button from '../Button.vue';
</script>

<template>
  <Button class="bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white">
    <slot />
  </Button>
</template>