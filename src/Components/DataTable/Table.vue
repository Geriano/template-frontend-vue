<script setup>
import { onMounted, ref } from 'vue';
import FormData from '../../form';
import store from '../../store';
import Input from '../Input.vue';
import Button from '../Button.vue';

const { url, element } = defineProps({
  url: String,
  element: {
    type: Object,
    default: {
      search: true,
      limit: true,
      links: true,
    },
  },
})

const first = ref(false)

onMounted(() => {
  ['search', 'limit', 'links'].forEach(key => !element.hasOwnProperty(key) && (element[key] = true))
})

const emit = defineEmits([
  'requested',
])

const paginator = ref({
  meta: {},
  data: [],
})

const form = new FormData({
  page: 1,
  per_page: 15,
  search: '',
  order: {
    key: '',
    dir: '',
  },
})

const timeout = ref(null)

const fetch = async () => {
  if (timeout.value) {
    clearTimeout(timeout.value)
  }

  timeout.value = setTimeout(async () => {
    try {
      const { status, data: response } = await form.post(url)
  
      if (status !== 422) {
        paginator.value.data = response.data
        paginator.value.meta = response.meta

        console.log(response)
      }
    } catch (e) {
      store.commit('flash', {
        type: 'error',
        message: `${e}`,
      })
  
      console.error(e)
    } finally {
      emit('requested', all)
      first.value = false
    }
  }, first.value ? 0 : 200)
}

onMounted(fetch)

const all = {
  url,
  paginator: paginator.value,
  form,
  refresh: fetch,
  search: value => {
    form.search = value
    fetch()
  },
}

defineExpose(all)
</script>

<template>
  <div class="flex flex-col space-y-2">
    <div v-if="element.limit || element.search" class="flex items-center md:justify-between">
      <div v-if="element.limit" class="flex items-center space-x-2 w-full md:w-1/3">
        <p class="flex-none lowercase first-letter:capitalize whitespace-nowrap">
          per page
        </p>

        <select v-model="form.per_page" class="bg-transparent border border-gray-200 dark:border-gray-800 rounded px-3 py-1">
          <option class="bg-gray-700" value="15">15</option>
          <option class="bg-gray-700" value="25">25</option>
          <option class="bg-gray-700" value="50">50</option>
          <option class="bg-gray-700" value="100">100</option>
        </select>
      </div>

      <div v-if="element.search" class="flex items-center space-x-2 w-full md:w-1/3">
        <p class="flex-none lowercase first-letter:capitalize">
          search
        </p>

        <Input
          v-model="form.search"
          type="search"
          placeholder="search"
          class="w-full max-w-sm"
        />
      </div>
    </div>
    <div class="w-full rounded overflow-auto">
      <table>
        <thead class="sticky top-0 left-0">
          <TransitionGroup name="-slide-y" leaveActiveClass="transition-none">
            <template v-if="paginator.data.length">
              <slot name="thead" :form="form" :refresh="fetch" :paginator="paginator" :data="paginator.data" />
            </template>

            <template v-else>
              <td class="py-2" colspan="1000" v-html="'&nbsp;'" />
            </template>
          </TransitionGroup>
        </thead>
        
        <tfoot>
          <TransitionGroup name="slide-y" leaveActiveClass="transition-none">
            <template v-if="paginator.data.length">
              <slot name="tfoot" :form="form" :refresh="fetch" :paginator="paginator" :data="paginator.data" />
            </template>

            <template v-else>
              <td class="py-2" colspan="1000" v-html="'&nbsp;'" />
            </template>
          </TransitionGroup>
        </tfoot>
        
        <tbody>
          <TransitionGroup name="opacity" leaveActiveClass="transition-none">
            <template v-if="paginator.data.length">
              <slot name="tbody" :form="form" :refresh="fetch" :paginator="paginator" :data="paginator.data" />
            </template>
  
            <template v-else>
              <td class="text-7xl text-center font-bold lowercase first-letter:capitalize p-4" colspan="1000">
                there are no data available
              </td>
            </template>
          </TransitionGroup>
        </tbody>
      </table>
    </div>

    <div class="flex space-x-2">
      <div class="w-full">
        <h3 class="lowercase first-letter:capitalize">
          displaying {{ paginator.data.length }} data from total {{ paginator.meta.total }}
        </h3>
      </div>

      <div v-if="paginator.meta.last_page > 1" class="flex-none flex items-center justify-end w-3/4 overflow-x-auto">
        <Button
          v-if="paginator.meta.previous_page_url"
          @click.prevent="form.page = paginator.meta.current_page - 1; fetch()"
          class="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-800 rounded-r-none"
        >
          <i class="bx bx-caret-left"></i>
          <p class="uppercase font-semibold">
            previous
          </p>
        </Button>

        <Button class="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-900 rounded-none">
          <p class="uppercase font-semibold">
            {{ paginator.meta.current_page }}
          </p>
        </Button>

        <Button
          v-if="paginator.meta.next_page_url"
          @click.prevent="form.page = paginator.meta.current_page + 1; fetch()"
          class="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-800 rounded-l-none"
        >
          <i class="bx bx-caret-right"></i>
          <p class="uppercase font-semibold">
            next
          </p>
        </Button>
      </div>
    </div>
  </div>
</template>