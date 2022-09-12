<script>
import { defineComponent, h } from 'vue';
import Link from './Link.vue';
import Links from './Links.vue';

export default defineComponent({
  props: {
    menus: Array,
    open: Boolean,
  },

  setup() {
    return props => {
      const { menus, open } = props

      const generate = (menu) => {
        if (menu.childs?.length) {
          return h(Links, {
            menu,
            open,
          }, menu.childs.map(child => generate(child)))
        }

        return h(Link, { menu, open })
      }
      
      return h('div', {
        class: 'flex flex-col space-y-1 w-full h-content',
      }, menus.map(menu => generate(menu)))
    }
  },
})
</script>