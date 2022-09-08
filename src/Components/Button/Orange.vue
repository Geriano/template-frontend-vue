<script setup>
import Button from '../Button.vue';
</script>

<template>
  <Button class="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white">
    <slot />
  </Button>
</template>