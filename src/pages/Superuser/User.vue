<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import Swal from 'sweetalert2'
import FormData from '../../form';
import axios from 'axios';
import Table from '../../Components/DataTable/Table.vue';
import Th from '../../Components/DataTable/Th.vue';
import Button from '../../Components/Button.vue';
import Card from '../../Components/Card.vue';
import Modal from '../../Components/Modal.vue';
import Input from '../../Components/Input.vue';
import InputError from '../../Components/InputError.vue';
import Close from '../../Components/Button/Close.vue';
import BtnGreen from '../../Components/Button/Green.vue';
import BtnBlue from '../../Components/Button/Blue.vue';
import BtnRed from '../../Components/Button/Red.vue';
import * as Store from '../../store';
import Select from '@vueform/multiselect'

const table = ref(null)
const fetch = () => table.value?.refresh()

const roles = ref([])

onMounted(async () => {
  try {
    const { data: response } = await axios.get(url(`/superuser/role`))
    roles.value = response
  } catch (e) {
    Store.commit('flash', {
      type: 'error',
      message: `${e}`,
    })
  }
})

const open = ref(false)
const form = new FormData({
  id: null,
  name: '',
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
  roles: [],
})

const edit = user => {
  form.id = user.id
  form.name = user.name
  form.username = user.username
  form.email = user.email
  form.roles = user.roles.map(p => p.id)

  open.value = true
}

const error = e => Store.commit('flash', {
  type: `error`,
  message: `${e}`,
})

const success = ({ status, data: response }) => {
  if (status !== 422) {
    open.value = false
    Store.commit('flash', response)
  }
}

const store = async () => {
  try {
    success(await form.post(
      url(`/superuser/user`)
    ))
  } catch (e) {
    error(e)
  } finally {
    await fetch()
  }
}

const update = async () => {
  try {
    success(await form.patch(
      url(`/superuser/user/${form.id}`)
    ))
  } catch (e) {
    error(e)
  } finally {
    await fetch()
  }
}

const submit = () => form.id ? update() : store()

const destroy = async (user) => {
  try {
    const { isConfirmed } = await Swal.fire({
      title: `are you sure want to delete?`,
      text: `you can't restore it after deleted`,
      icon: 'question',
      showCloseButton: true,
      showCancelButton: true,
    })

    if (!isConfirmed) return

    success(await axios.delete(
      url(`/superuser/user/${user.id}`)
    ))
  } catch (e) {
    error(e)
  } finally {
    await fetch()
  }
}

const esc = e => e.key === 'Escape' && (open.value = false)

onMounted(() => document.addEventListener('keydown', esc))
onUnmounted(() => document.removeEventListener('keydown', esc))
</script>

<template>
  <Card>
    <template #header>
      <div class="flex items-center space-x-2 justify-between w-full">
        <div class="flex items-center justify-between w-full">
          <BtnGreen @click.prevent="form.reset(); open = ! open" class="text-sm">
            <i class="text-md mdi mdi-plus" />
            <p class="capitalize font-semibold">
              create
            </p>
          </BtnGreen>

          <select 
            @change.prevent="table.limit($event.target.value)"
            class="dark:bg-gray-700 border border-gray-100 dark:border-gray-600 px-3 py-2 text-xs rounded"
          >
            <option value="2">2</option>
            <option value="15" selected>15</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        <Input
          @input.prevent="table.search($event.target.value)"
          type="search"
          class="max-w-xs dark:bg-gray-700 dark:border-gray-600 py-1"
          placeholder="search something"
          autofocus
        />
      </div>
    </template>

    <template #body>
      <div class="flex-wrap p-4 min-h-content">
        <Table
          :url="url('/superuser/user/paginate')"
          :element="{
            limit: false,
            search: false,
          }"
          ref="table"
        >
          <template #thead="table">
            <tr class="sticky top-0 left-0">
              <Th :table="table" :sortable="false" class="uppercase">no</Th>
              <Th :table="table" :sortable="true" name="name" class="uppercase">name</Th>
              <Th :table="table" :sortable="true" name="username" class="uppercase">username</Th>
              <Th :table="table" :sortable="true" name="email" class="uppercase">email</Th>
              <Th :table="table" :sortable="false" class="uppercase">roles</Th>
              <Th :table="table" :sortable="false" class="uppercase">#</Th>
            </tr>
          </template>

          <template #tfoot="table">
            <tr class="sticky top-0 left-0">
              <Th :table="table" :sortable="false" class="uppercase">no</Th>
              <Th :table="table" :sortable="true" name="name" class="uppercase">name</Th>
              <Th :table="table" :sortable="true" name="username" class="uppercase">username</Th>
              <Th :table="table" :sortable="true" name="email" class="uppercase">email</Th>
              <Th :table="table" :sortable="false" class="uppercase">roles</Th>
              <Th :table="table" :sortable="false" class="uppercase">#</Th>
            </tr>
          </template>

          <template #tbody="{ data }">
            <template v-for="(user, i) in data" :key="i">
              <tr>
                <td class="whitespace-nowrap text-center">
                  {{ i + 1 }}
                </td>

                <td class="whitespace-nowrap">
                  {{ user.name }}
                </td>

                <td class="whitespace-nowrap">
                  {{ user.username }}
                </td>

                <td class="whitespace-nowrap">
                  {{ user.email }}
                </td>

                <td>
                  <div class="flex-wrap">
                    <Button
                      v-for="(user, j) in user.roles" :key="j"
                      class="bg-gray-200 dark:bg-gray-800 cursor-default m-[1px]"
                    >
                      <p class="capitalize font-semibold">
                        {{ user.name }}
                      </p>
                    </Button>
                  </div>
                </td>

                <td>
                  <div class="flex items-center space-x-1">
                    <BtnBlue @click.prevent="edit(user)">
                      <i class="mdi mdi-pen" />
                      <p class="capitalize font-semibold">
                        edit
                      </p>
                    </BtnBlue>

                    <BtnRed @click.prevent="destroy(user)">
                      <i class="mdi mdi-delete" />
                      <p class="capitalize font-semibold">
                        delete
                      </p>
                    </BtnRed>
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </Table>
      </div>
    </template>
  </Card>

  <Modal :open="open">
    <form @submit.prevent="submit" class="w-full max-w-md h-fit shadow mx-auto">
      <Card>
        <template #header>
          <div class="flex items-center space-x-1 justify-end w-full">
            <Close @click.prevent="open = false" />
          </div>
        </template>

        <template #body>
          <div class="flex flex-col space-y-2 p-4">
            <div class="flex flex-col space-y-1">
              <div class="flex items-center space-x-1">
                <label for="name" class="flex-none w-1/4 lowercase first-letter:capitalize">
                  name
                </label>
  
                <Input
                  v-model="form.name"
                  type="text"
                  placeholder="name"
                  class="uppercase py-[.45rem]"
                  required
                  autofocus
                />
              </div>
  
              <InputError :error="form.errors.name" />
            </div>

            <div class="flex flex-col space-y-1">
              <div class="flex items-center space-x-1">
                <label for="username" class="flex-none w-1/4 lowercase first-letter:capitalize">
                  username
                </label>
  
                <Input
                  v-model="form.username"
                  type="text"
                  placeholder="username"
                  class="uppercase py-[.45rem]"
                  required
                />
              </div>
  
              <InputError :error="form.errors.username" />
            </div>

            <div class="flex flex-col space-y-1">
              <div class="flex items-center space-x-1">
                <label for="email" class="flex-none w-1/4 lowercase first-letter:capitalize">
                  email
                </label>
  
                <Input
                  v-model="form.email"
                  type="email"
                  placeholder="email"
                  class="uppercase py-[.45rem]"
                  required
                />
              </div>
  
              <InputError :error="form.errors.email" />
            </div>

            <div class="flex flex-col space-y-1">
              <div class="flex items-center space-x-1">
                <label for="password" class="flex-none w-1/4 lowercase first-letter:capitalize">
                  password
                </label>
  
                <Input
                  v-model="form.password"
                  type="password"
                  placeholder="password"
                  class="uppercase py-[.45rem]"
                  required
                />
              </div>
  
              <InputError :error="form.errors.password" />
            </div>

            <div class="flex flex-col space-y-1">
              <div class="flex items-center space-x-1">
                <label for="password_confirmation" class="flex-none w-1/4 lowercase first-letter:capitalize">
                  password confirmation
                </label>
  
                <Input
                  v-model="form.password_confirmation"
                  type="password"
                  placeholder="password confirmation"
                  class="uppercase py-[.45rem]"
                  required
                />
              </div>
  
              <InputError :error="form.errors.password_confirmation" />
            </div>

            <div class="flex flex-col space-y-1">
              <div class="flex space-x-1">
                <label for="roles" class="flex-none w-1/4 lowercase first-letter:capitalize">
                  roles
                </label>

                <Select
                  v-model="form.roles"
                  :options="roles.map(p => ({
                    label: p.name,
                    value: p.id,
                  }))"
                  :searchable="true"
                  placeholder="roles"
                  mode="tags"
                />
              </div>

              <InputError :error="form.errors.roles" />
            </div>
          </div>
        </template>

        <template #footer>
          <div class="flex items-center space-x-1 justify-end w-full">
            <BtnGreen
              :disabled="form.processing"
              type="submit"
            >
              <i class="mdi mdi-check" />
              <p class="capitalize font-semibold">
                {{ form.id ? 'update' : 'create' }}
              </p>
            </BtnGreen>
          </div>
        </template>
      </Card>
    </form>
  </Modal>
</template>