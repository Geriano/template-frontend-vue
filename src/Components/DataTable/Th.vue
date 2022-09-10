<script setup>
import { onMounted, onUpdated, ref } from 'vue';

const { table, sortable, name } = defineProps({
  table: Object,
  sortable: Boolean,
  name: String,
})

if (!table) throw Error(`table props is missing in th`)
if (sortable && !name) throw Error(`sortable name is missing`)

const current = ref(table.form.order.key === name)
const dir = ref(table.form.order.dir || 'asc')

const sort = () => {
  if (table.form.order.key === name) {
    dir.value = table.form.order.dir = dir.value === 'asc' ? 'desc' : 'asc'
  } else {
    table.form.order.key = name
    table.form.order.dir = 'asc'
    dir.value = 'asc'
    current.value = name
  }

  table.refresh()
}
</script>

<template>
  <th
    class="sticky top-0 left-0"
    :class="{
      'cursor-pointer': sortable,
    }"
    @click.prevent="sortable && sort()"
  >
    <div class="flex items-center space-x-1 px-3 py-2">
      <div class="w-full h-full">
        <slot />
      </div>

      <div v-if="sortable" class="flex-none flex flex-col text-xs">
        <i
          class="bx bx-caret-up"
          :class="{
            'text-white': current && dir === 'asc',
            'text-gray-500': !current,
          }"
        />
        <i
          class="bx bx-caret-down"
          :class="{
            'text-white': current && dir === 'desc',
            'text-gray-500': !current,
          }"
        />
      </div>
    </div>
  </th>
</template>