<template>
  <div class="card w-full h-fit">
    <div class="sticky top-0 left-0 z-10" :class="$slots.header && 'header'">
      <slot name="header" />
    </div>

    <div>
      <slot name="body" />
    </div>

    <div :class="$slots.footer && 'footer'">
      <slot name="footer" />
    </div>

    <div class="sticky bottom-0 left-0 z-10" :class="$slots['footer-sticky'] && 'footer'">
      <slot name="footer-sticky" />
    </div>
  </div>
</template>