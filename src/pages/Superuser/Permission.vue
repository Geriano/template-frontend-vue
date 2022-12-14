<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import Swal from 'sweetalert2'
import FormData from '../../form';
import axios from 'axios';
import Button from '../../Components/Button.vue';
import Close from '../../Components/Button/Close.vue';
import Card from '../../Components/Card.vue';
import Modal from '../../Components/Modal.vue';
import Input from '../../Components/Input.vue';
import InputError from '../../Components/InputError.vue';
import BtnGreen from '../../Components/Button/Green.vue';
import BtnBlue from '../../Components/Button/Blue.vue';
import BtnRed from '../../Components/Button/Red.vue';
import * as Store from '../../store';

const permissions = ref([])

const fetch = async () => {
  try {
    const { data: response } = await axios.get(url(`/superuser/permission`))

    permissions.value = response
  } catch (e) {
    Store.commit('flash', {
      type: 'error',
      message: `${e}`,
    })

    console.error(e)
  }
}

onMounted(fetch)

const search = ref('')
const open = ref(false)
const form = new FormData({
  id: null,
  name: '',
})

const edit = permission => {
  form.id = permission.id
  form.name = permission.name

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
      url(`/superuser/permission`)
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
      url(`/superuser/permission/${form.id}`)
    ))
  } catch (e) {
    error(e)
  } finally {
    await fetch()
  }
}

const submit = () => form.id ? update() : store()

const destroy = async (permission) => {
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
      url(`/superuser/permission/${permission.id}`)
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
      <div class="flex items-center justify-between w-full">
        <BtnGreen @click.prevent="form.reset(); open = ! open">
          <i class="text-md mdi mdi-plus" />
          <p class="capitalize font-semibold">
            create
          </p>
        </BtnGreen>

        <Input
          v-model="search"
          type="search"
          class="max-w-xs dark:bg-gray-700 dark:border-gray-600 py-1"
          placeholder="search something"
          autofocus
        />
      </div>
    </template>

    <template #body>
      <div class="flex-wrap p-4 min-h-content">
        <TransitionGroup name="-slide-y">
          <Button v-for="(permission, i) in permissions.filter(p => p.name.toLowerCase().includes(search.trim().toLocaleLowerCase()))" :key="i" class="bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-800 w-fit m-[1px] rounded leading-tight text-sm cursor-default">
            <div class="flex items-center space-x-2">
              <p class="capitalize font-semibold">
                {{ permission.name }}
              </p>

              <div class="flex-none flex items-center border border-gray-100 dark:border-gray-600 rounded">
                <BtnBlue @click.prevent="edit(permission)" class="rounded-r-none px-2 py-0">
                  <i class="mdi mdi-pen" />
                </BtnBlue>

                <BtnRed @click.prevent="destroy(permission)" class="rounded-l-none px-2 py-0">
                  <i class="mdi mdi-delete" />
                </BtnRed>
              </div>
            </div>
          </Button>
        </TransitionGroup>
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
          <div class="flex flex-col space-y-1 p-4">
            <Input
              v-model="form.name"
              type="text"
              placeholder="name"
              class="uppercase py-1"
              required
              autofocus
            />

            <InputError :error="form.errors.name" />
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