<script setup>
import { ref } from 'vue';
import * as Store from '../../../store';
import Button from '../../../Components/Button.vue';
import InputError from '../../../Components/InputError.vue';
import axios from 'axios';

defineProps(['modelValue'])
defineEmits(['update:modelValue'])
const { user } = Store.state

const input = ref(null)

const store = file => {
  const url = URL.createObjectURL(file)

  user.profile_photo_url = url
}

const remove = async () => {
  try {
    const { data: response } = await axios.delete(url('remove-profile-photo'))
    const { message } = response

    Store.state.user.profile_photo_url = null

    Store.commit('flash', {
      type: 'success',
      message,
    })
  } catch (e) {
    Store.commit('flash', {
      type: 'error',
      message: `${e}`,
    })
  }
}
</script>

<template>
  <div class="flex flex-col space-y-2">
    <div class="flex items-center space-x-2 justify-around">
      <input @input="$emit('update:modelValue', $event.target.files[0])" @change="store($event.target.files[0])" ref="input" type="file" class="hidden">
      <div class="flex items-center justify-center w-20 h-20 border dark:border-gray-600 rounded-full">
        <img v-if="user.profile_photo_url" :src="user.profile_photo_url.startsWith('blob:') ? user.profile_photo_url : url(user.profile_photo_url)" :alt="user.name" class="w-full h-full rounded-full">
        <i v-else class="mdi mdi-account text-3xl"></i>
      </div>

      <div class="flex items-center space-x-1">
        <Button
          @click.prevent="$refs.input.click()"
          type="button"
          class="bg-gray-600 hover:bg-gray-700 text-gray-50"
        >
          <i
            :class="{
              'mdi-tray-arrow-up': !user.profile_photo_url,
              'mdi-cached': user.profile_photo_url,
            }"
            class="mdi"
          />

          <div class="uppercase font-semibold text-sm">
            {{ user.profile_photo_url ? 'change' : 'upload' }}
          </div>
        </Button>

        <Transition name="slide-x">
          <Button
            @click.prevent="remove"
            v-if="user.profile_photo_url"
            type="button"
            class="bg-gray-600 hover:bg-gray-700 text-gray-50"
          >
            <i class="mdi mdi-delete"></i>
            <div class="uppercase font-semibold text-sm">
              remove
            </div>
          </Button>
        </Transition>
      </div>
    </div>

    <InputError :error="error" />
  </div>
</template>