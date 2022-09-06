<script setup>
import { ref } from 'vue';
import store, { state } from '../../store';
import FormData from '../../form';
import DashboardLayout from '../../Layouts/DashboardLayout.vue';
import Button from '../../Components/Button.vue';
import Card from '../../Components/Card.vue';
import Input from '../../Components/Input.vue';
import InputError from '../../Components/InputError.vue';
import Photo from './Profile/Photo.vue'

const { user } = state

const general = new FormData({
  name: user.name,
  username: user.username,
  email: user.email,
})

const hidden = ref(true)
const security = new FormData({
  password: '',
  password_confirmation: '',
})

const submitGeneralForm = async () => {
  try {
    const { data: response } = await general.patch(url('update-user-general-information'), {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const { message } = response.message

    store.commit('flash', {
      type: 'success',
      message,
    })
  } catch (e) {
    store.commit('flash', {
      type: 'error',
      message: `${e}`,
    })

    console.error(e)
  } finally {
    store.dispatch('relog')
  }
}

const submitSecurityForm = async () => {
  try {
    const { data: response } = await general.patch(url('update-user-security-information'), {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const { message } = response.message

    store.commit('flash', {
      type: 'success',
      message,
    })
  } catch (e) {
    store.commit('flash', {
      type: 'error',
      message: `${e}`,
    })

    console.error(e)
  } finally {
    store.dispatch('relog')
  }
}
</script>

<template>
  <DashboardLayout title="Profile">
    <form @submit.prevent="submitGeneralForm" class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 md:items-center md:justify-between">
      <div class="w-full md:w-1/3">
        <h1 class="text-xl font-semibold lowercase first-letter:capitalize">
          general information
        </h1>
      </div>
      <Card class="md:max-w-3xl">
        <template #body>
          <div class="flex flex-col space-y-2 p-4">
            <Photo />

            <div class="flex flex-col space-y-1">
              <div class="flex flex-col space-y-2">
                <label for="name" class="lowercase first-letter:capitalize font-semibold">
                  name
                </label>

                <div class="relative">
                  <div
                    class="absolute top-0 left-0 h-full flex items-center dark:bg-gray-600 rounded-l px-2"
                    :class="{ 'bg-red-500 dark:bg-red-500': general.errors.name }"
                  >
                    <i class="mdi mdi-at text-xl"></i>
                  </div>
                  <Input
                    v-model="general.name"
                    :class="{
                      'border border-red-500 dark:border-red-500': general.errors.name,
                    }"
                    class="pl-12"
                    type="text"
                    placeholder="name"
                    required
                    autofocus
                  />
                </div>
              </div>

              <InputError
                :error="general.errors.name"
                class="text-right"
              />
            </div>

            <div class="flex flex-col space-y-1">
              <div class="flex flex-col space-y-2">
                <label for="username" class="lowercase first-letter:capitalize font-semibold">
                  username
                </label>

                <div class="relative">
                  <div
                    class="absolute top-0 left-0 h-full flex items-center dark:bg-gray-600 rounded-l px-2"
                    :class="{ 'bg-red-500 dark:bg-red-500': general.errors.username }"
                  >
                    <i class="mdi mdi-account text-xl"></i>
                  </div>
                  <Input
                    v-model="general.username"
                    :class="{
                      'border border-red-500 dark:border-red-500': general.errors.username,
                    }"
                    class="pl-12"
                    type="text"
                    placeholder="username"
                    required
                  />
                </div>
              </div>

              <InputError
                :error="general.errors.username"
                class="text-right"
              />
            </div>

            <div class="flex flex-col space-y-1">
              <div class="flex flex-col space-y-2">
                <label for="email" class="lowercase first-letter:capitalize font-semibold">
                  email
                </label>

                <div class="relative">
                  <div
                    class="absolute top-0 left-0 h-full flex items-center dark:bg-gray-600 rounded-l px-2"
                    :class="{ 'bg-red-500 dark:bg-red-500': general.errors.email }"
                  >
                    <i class="mdi mdi-email-outline text-xl"></i>
                  </div>
                  <Input
                    v-model="general.email"
                    :class="{
                      'border border-red-500 dark:border-red-500': general.errors.email,
                    }"
                    class="pl-12"
                    type="email"
                    placeholder="email"
                    required
                  />
                </div>
              </div>

              <InputError
                :error="general.errors.email"
                class="text-right"
              />
            </div>
          </div>
        </template>

        <template #footer>
          <div class="flex items-center space-x-1 justify-end w-full">
            <Button class="bg-gray-600 hover:bg-gray-700 text-sm">
              <i class="mdi mdi-check"></i>
              <p class="uppercase font-semibold">
                update
              </p>
            </Button>
          </div>
        </template>
      </Card>
    </form>

    <form @submit.prevent="submitSecurityForm" class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 md:items-center md:justify-between">
      <div class="w-full md:w-1/3">
        <h1 class="text-xl font-semibold lowercase first-letter:capitalize">
          security
        </h1>
      </div>
      <Card class="md:max-w-3xl">
        <template #body>
          <div class="flex flex-col space-y-2 p-4">
            <div class="flex flex-col space-y-1">
              <div class="flex flex-col space-y-2">
                <label for="password" class="lowercase first-letter:capitalize font-semibold">
                  password
                </label>

                <div class="relative">
                  <div
                    @click.prevent="hidden = ! hidden"
                    class="absolute top-0 left-0 h-full flex items-center dark:bg-gray-600 rounded-l px-2 cursor-pointer"
                    :class="{ 'bg-red-500 dark:bg-red-500': general.errors.password, 'bg-orange-500 dark:bg-orange-500': !hidden }"
                  >
                    <i :class="!hidden && 'rotate-180 text-white'" class="mdi mdi-form-textbox-password text-xl transition-all duration-500"></i>
                  </div>
                  <Input
                    v-model="general.password"
                    :type="hidden ? 'password' : 'text'"
                    :class="{
                      'border border-red-500 dark:border-red-500': general.errors.password,
                      'border border-orange-500 dark:border-orange-500 ring-orange-500': !hidden,
                    }"
                    class="pl-12"
                    placeholder="password"
                    required
                  />
                </div>
              </div>

              <InputError
                :error="security.errors.password"
                class="text-right"
              />
            </div>

            <div class="flex flex-col space-y-1">
              <div class="flex flex-col space-y-2">
                <label for="password_confirmation" class="lowercase first-letter:capitalize font-semibold">
                  password confirmation
                </label>

                <div class="relative">
                  <div
                    @click.prevent="hidden = ! hidden"
                    class="absolute top-0 left-0 h-full flex items-center dark:bg-gray-600 rounded-l px-2 cursor-pointer"
                    :class="{ 'bg-red-500 dark:bg-red-500': general.errors.password_confirmation, 'bg-orange-500 dark:bg-orange-500': !hidden }"
                  >
                  <i :class="!hidden && 'rotate-180 text-white'" class="mdi mdi-form-textbox-password text-xl transition-all duration-500"></i>
                  </div>
                  <Input
                    v-model="general.password_confirmation"
                    :type="hidden ? 'password' : 'text'"
                    :class="{
                      'border border-red-500 dark:border-red-500': general.errors.password_confirmation,
                      'border border-orange-500 dark:border-orange-500 ring-orange-500': !hidden,
                    }"
                    class="pl-12"
                    placeholder="password confirmation"
                    required
                  />
                </div>
              </div>

              <InputError
                :error="security.errors.password_confirmation"
                class="text-right"
              />
            </div>
          </div>
        </template>

        <template #footer>
          <div class="flex items-center space-x-1 justify-end w-full">
            <Button class="bg-gray-600 hover:bg-gray-700 text-sm">
              <i class="mdi mdi-check"></i>
              <p class="uppercase font-semibold">
                update
              </p>
            </Button>
          </div>
        </template>
      </Card>
    </form>
  </DashboardLayout>
</template>