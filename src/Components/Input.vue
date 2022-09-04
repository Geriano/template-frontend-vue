<script setup>
import { onMounted, ref } from 'vue';

defineProps(['modelValue'])
defineEmits('update:modelValue')
const input = ref(null)

defineExpose({
  focus: () => input.value.focus(),
})

onMounted(() => {
  if (input.value.hasAttribute('autofocus')) {
    input.value.focus()
  }
})
</script>

<template>
  <input
    @input="$emit('update:modelValue', $event.target.value)"
    :value="modelValue"
    class="bg-transparent w-full rounded focus:outline-none focus:ring ring-teal-500 border dark:border-gray-600 px-3 py-1 transition-all duration-300"
    ref="input"
  >
</template>