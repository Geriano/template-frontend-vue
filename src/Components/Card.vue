<template>
  <div class="card w-full h-fit">
    <div v-if="$slots.header" class="header">
      <slot name="header" />
    </div>

    <div class="h-full">
      <slot name="body" />
    </div>

    <div v-if="$slots.footer" class="footer">
      <slot name="footer" />
    </div>
  </div>
</template>