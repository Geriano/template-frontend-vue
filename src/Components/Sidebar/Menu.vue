<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import store from '../../store';

const menus = ref([])

const fetch = async () => {
  try {
    const { data: response } = await axios.get(url(`/superuser/menu`))
    menus.value = response
  } catch (e) {
    store.commit('flash', {
      type: 'error',
      message: `${e}`,
    })
  }
}

onMounted(fetch)
</script>