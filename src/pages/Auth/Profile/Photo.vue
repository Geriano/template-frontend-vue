<script setup>
import { ref } from 'vue';
import FormData from '../../../form'; 
import * as Store from '../../../store';
import Button from '../../../Components/Button.vue';

const { user } = Store.state

const input = ref(null)
const form = new FormData({
  photo: null,
})

const store = async () => {
  try {
    const { data: response } = await form.post(url('update-profile-photo'))
    const { message } = response

    Store.commit('flash', {
      type: 'success',
      message,
    })
  } catch (e) {
    const { response } = e
    const { data } = response
    const { message } = data

    Store.commit('flash', {
      type: 'error',
      message,
    })
  } finally {
    Store.dispatch('relog')
  }
}
</script>

<template>
  <div class="flex items-center space-x-2 justify-around">
    <input @input="form.photo = $event.target.files[0]" @change="store" ref="input" type="file" class="hidden">
    <div class="flex items-center justify-center w-14 h-14 border dark:border-gray-600 rounded-full">
      <img v-if="user.profile_photo_url" :src="user.profile_photo_url" :alt="user.name" class="w-full h-full">
      <i v-else class="mdi mdi-account text-3xl"></i>
    </div>

    <div class="flex items-center space-x-1">
      <Button
        @click.prevent="$refs.input.click()"
        type="button"
        class="dark:bg-gray-600"
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
        <Button v-if="user.profile_photo_url" type="button" class="dark:bg-gray-600">
          <i class="mdi mdi-delete"></i>
          <div class="uppercase font-semibold text-sm">
            remove
          </div>
        </Button>
      </Transition>
    </div>
  </div>
</template>