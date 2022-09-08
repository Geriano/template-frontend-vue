<script setup>
import Button from '../Button.vue';
</script>

<template>
  <Button class="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white">
    <slot />
  </Button>
</template>