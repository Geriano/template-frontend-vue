<script setup>
import { ref, toRef } from 'vue';
import Draggable from 'vuedraggable'
import { cloneDeep } from 'lodash'

const { menus } = defineProps({
  menus: Array,
})

const emit = defineEmits(['edit', 'destroy', 'change'])

const change = menus => emit('change', menus)
</script>

<template>
  <Draggable
    tag="ul"
    :list="menus"
    :group="{ name: 'g1' }"
    item-key="id"
    @change="change(menus)"
  >
    <template #item="{ element: menu }">
      <div class="flex flex-col space-y-1">
        <div class="flex items-center space-x-2 bg-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900 rounded-md px-4 py-2 transition-all cursor-move">
          <div class="flex items-center space-x-2 w-full">
            <i :class="menu.icon" />
            <p class="uppercase">{{ menu.name }}</p>
          </div>

          <div class="flex-none flex items-center rounded-md space-x-1">
            <i @click.prevent="emit('edit', menu)" class="mdi mdi-pencil bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded-md text-sm text-white transition-all cursor-pointer" />
            <i @click.prevent="emit('destroy', menu)" class="mdi mdi-delete bg-red-600 hover:bg-red-700 px-2 py-1 rounded-md text-sm text-white transition-all cursor-pointer" />
          </div>
        </div>

        <Nested :menus="menu.childs" @edit="emit('edit', $event)" @destroy="emit('destroy', $event)" @change="change($event)" class="ml-8" />
      </div>
    </template>
  </Draggable>
</template>