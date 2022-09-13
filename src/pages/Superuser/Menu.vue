<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import Swal from 'sweetalert2'
import FormData from '../../form';
import axios from 'axios';
import Button from '../../Components/Button.vue';
import Card from '../../Components/Card.vue';
import Modal from '../../Components/Modal.vue';
import Input from '../../Components/Input.vue';
import InputError from '../../Components/InputError.vue';
import BtnGreen from '../../Components/Button/Green.vue';
import BtnBlue from '../../Components/Button/Blue.vue';
import BtnRed from '../../Components/Button/Red.vue';
import * as Store from '../../store';
import Select from '@vueform/multiselect'
import Routes from '../../routes';
import Nested from './Nested.vue'
import icons from '../../icons.json'

import { cloneDeep } from 'lodash'

const names = {
  mdi: 'material design icon',
  bx: 'boxicon',
  la: 'line awesome',
}

const flatMap = route => {
  if (route.children) {
    return route.children.flatMap(flatMap)
  }

  return route.name
}

const routes = Routes.flatMap(flatMap).filter(route => route)

const permissions = ref([])
const getAvailablePermissions = async () => {
  try {
    const { data: response } = await axios.get(url(`/superuser/permission`))
    permissions.value = response
  } catch (e) {
    Store.commit('flash', {
      type: 'error',
      message: `${e}`,
    })
  }
}

onMounted(getAvailablePermissions)

const search = ref('')
const type = ref('mdi')
const menus = ref([])
const open = ref({ form: false, icon: false })
const form = new FormData({
  id: null,
  name: '',
  icon: 'mdi mdi-circle',
  route_or_url: '',
  actives: [],
  permissions: [],
})

const edit = menu => {
  form.id = menu.id
  form.name = menu.name
  form.icon = menu.icon
  form.route_or_url = menu.route_or_url
  form.actives = menu.actives || []
  form.permissions = menu.permissions.map(p => p.id)

  open.value.form = true
}

const store = async () => {
  try {
    const { status, data: response } = await form.post(url('/superuser/menu'))

    if (status !== 422) {
      open.value.form = false
      Store.commit('flash', response)
    }
  } catch (e) {
    Store.commit('flash', {
      type: 'error',
      message: `${e}`,
    })
  } finally {
    await fetch()
  }
}

const update = async () => {
  try {
    const { status, data: response } = await form.patch(url(`/superuser/menu/${form.id}`))

    if (status !== 422) {
      open.value.form = false
      Store.commit('flash', response)
    }
  } catch (e) {
    Store.commit('flash', {
      type: 'error',
      message: `${e}`,
    })
  } finally {
    await fetch()
  }
}

const destroy = async menu => {
  try {
    const { isConfirmed } = await Swal.fire({
      title: `are you sure want to delete?`,
      text: `you can't restore it after deleted`,
      icon: 'question',
      showCloseButton: true,
      showCancelButton: true,
    })

    if (!isConfirmed) return

    const { data: response } = await axios.delete(url(`/superuser/menu/${menu.id}`))

    Store.commit('flash', response)
  } catch (e) {
    Store.commit('flash', {
      type: 'error',
      message: `${e}`,
    })

    console.error(e)
  } finally {
    await fetch()
  }
}

const submit = () => form.id ? update() : store()

const fetch = async () => {
  try {
    const { data: response } = await axios.get(url(`/menu`))
    menus.value = response
  } catch (e) {
    Store.store.commit('flash', {
      type: 'error',
      message: `${e}`,
    })
  }
}

onMounted(fetch)

const timeout = ref(null)
const change = () => {
  clearTimeout(timeout.value)

  Swal.fire({
    title: 'Loading...',
    showConfirmButton: false,
    showCloseButton: true,
  })

  Swal.showLoading()

  timeout.value = setTimeout(async () => {
    try {
      const { data: response } = await axios.patch(url('/superuser/menu/save'), { menus: menus.value })
      menus.value = response

      Store.commit('flash', {
        type: `success`,
        message: 'menu position has been updated',
      })
    } catch (e) {
      Store.commit('flash', {
        type: 'error',
        message: `${e}`,
      })
    } finally {
      Swal.close()
    }
  }, 200)
}
</script>

<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between w-full">
        <BtnGreen @click.prevent="form.reset(); open.form = ! open.form" class="text-sm">
          <i class="text-md mdi mdi-plus" />
          <p class="uppercase font-semibold">
            create
          </p>
        </BtnGreen>
      </div>
    </template>

    <template #body>
      <div class="flex flex-col space-y-2 p-4">
        <Nested
          v-if="menus.length"
          :menus="menus"
          @change="change"
          @edit="edit"
          @destroy="destroy"
        />
      </div>
    </template>
  </Card>

  <Modal :open="open.form">
    <form @submit.prevent="submit" class="w-full max-w-xl h-fit shadow mx-auto">
      <Card>
        <template #header>
          <div class="flex items-center space-x-1 justify-end w-full">
            <i @click.prevent="open.form = false" class="mdi mdi-close rounded bg-red-500 px-1 cursor-pointer" />
          </div>
        </template>

        <template #body>
          <div class="flex flex-col space-y-2 p-4">
            <div class="flex flex-col space-y-1">
              <div class="flex items-center space-x-2">
                <label for="name" class="flex-none w-1/4 lowercase first-letter:capitalize font-semibold">
                  name
                </label>

                <Input
                  v-model="form.name"
                  type="text"
                  placeholder="name"
                  class="uppercase"
                  required
                  autofocus
                />
              </div>

              <InputError :error="form.errors.name" />
            </div>

            <div class="flex flex-col space-y-1">
              <div class="flex items-center space-x-2">
                <label for="route_or_url" class="flex-none w-1/4 lowercase first-letter:capitalize font-semibold">
                  route or url
                </label>

                <Select
                  v-model="form.route_or_url"
                  :options="routes"
                  :searchable="true"
                  :createOption="true"
                  placeholder="route or url"
                  class="uppercase"
                  required
                />
              </div>

              <InputError :error="form.errors.route_or_url" />
            </div>

            <div class="flex flex-col space-y-1">
              <div class="flex items-center space-x-2">
                <label for="actives" class="flex-none w-1/4 lowercase first-letter:capitalize font-semibold">
                  actives
                </label>

                <Select
                  v-model="form.actives"
                  :options="routes"
                  :searchable="true"
                  :closeOnSelect="false"
                  :clearOnSelect="false"
                  :createTag="true"
                  placeholder="actives"
                  class="uppercase"
                  mode="tags"
                />
              </div>

              <InputError :error="form.errors.actives" />
            </div>

            <div class="flex flex-col space-y-1">
              <div class="flex items-center space-x-2">
                <label for="permissions" class="flex-none w-1/4 lowercase first-letter:capitalize font-semibold">
                  permissions
                </label>

                <Select
                  v-model="form.permissions"
                  :options="permissions.map(p => ({
                    label: p.name,
                    value: p.id,
                  }))"
                  :searchable="true"
                  :closeOnSelect="false"
                  :clearOnSelect="false"
                  placeholder="permissions"
                  class="uppercase"
                  mode="tags"
                />
              </div>

              <InputError :error="form.errors.permissions" />
            </div>

            <div class="flex items-center space-x-2 justify-between">
              <i :class="form.icon" class="text-xl" />

              <p class="uppercase font-semibold">
                {{ form.icon }}
              </p>

              <BtnBlue @click.prevent="open.icon = true" type="buttonnpx vite ">
                <p class="uppercase font-semibold">
                  change
                </p>
              </BtnBlue>
            </div>
          </div>
        </template>

        <template #footer-sticky>
          <div class="flex items-center space-x-1 justify-end w-full">
            <BtnGreen
              :disabled="form.processing"
              type="submit"
            >
              <i class="mdi mdi-check" />
              <p class="uppercase font-semibold">
                {{ form.id ? 'update' : 'create' }}
              </p>
            </BtnGreen>
          </div>
        </template>
      </Card>
    </form>
  </Modal>

  <Modal :open="open.icon">
    <Card class="max-w-7xl mx-auto">
      <template #header>
        <div class="flex items-center space-x-1 justify-between w-full">
          <Input
            v-model="search"
            type="search"
            placeholder="search"
            class="max-w-sm"
            autofocus
          />

          <div class="flex items-center space-x-2">
            <div class="flex items-center">
              <template v-for="(key, i) in Object.keys(icons)" :key="i">
                <Button
                  @click.prevent="type = key"
                  class="hover:bg-gray-100 dark:hover:bg-gray-700"
                  :class="{
                    'rounded-none': i > 0 && i + 1 < Object.keys(icons).length,
                    'rounded-r-none': i === 0,
                    'rounded-l-none': i + 1 === Object.keys(icons).length,
                    'bg-gray-100 dark:bg-gray-700': type.toLowerCase() === key.toLowerCase(),
                    'bg-gray-200 dark:bg-gray-600': type.toLowerCase() !== key.toLowerCase(),
                  }"
                >
                  <div class="font-semibold uppercase">
                    <p>{{ names[key.toLowerCase()] }} <sup>{{ icons[key].length }}</sup></p>
                  </div>
                </Button>
              </template>
            </div>

            <i @click.prevent="open.icon = false" class="mdi mdi-close rounded bg-red-500 px-1 cursor-pointer" />
          </div>
        </div>
      </template>

      <template #body>
        <div class="max-w-7xl min-h-[30rem] p-4">
          <div class="flex-wrap">
            <i
              v-for="(c, i) in icons[type].filter(name => name.toLowerCase().includes(search.trim().toLowerCase()))" :key="i"
              @click.prevent="form.icon = `${type} ${type}-${c}`; open.icon = false"
              :title="c"
              class="text-5xl px-2 rounded mx-1 my-3 cursor-pointer"
              :class="`${type} ${type}-${c}`"
            />
          </div>
        </div>
      </template>
    </Card>
  </Modal>
</template>