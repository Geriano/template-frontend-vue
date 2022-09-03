<script setup>
import axios from 'axios';
import { onMounted, Teleport, watch, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import AuthLayout from './layouts/AuthLayout.vue'
import DashboardLayout from './layouts/DashboardLayout.vue';

const router = useRouter()
const Layout = ref(null)

onMounted(async () => {
  await router.isReady()
  const current = router.currentRoute.value
  Layout.value = ['login', 'register'].includes(current.path.replace(/^\//g, '')) ? AuthLayout : DashboardLayout
})
</script>

<template>
  <div class="bg-gray-300 dark:bg-gray-900 dark:text-gray-300 w-full h-screen">
    <Teleport to="head">
      <link rel="stylesheet" href="/vendors/css/icons.css">
    </Teleport>

    <Layout v-if="Layout">
      <RouterView :user="user" :router="router" />
    </Layout>
  </div>
</template>