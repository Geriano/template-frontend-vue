<script>
import { defineComponent, h } from 'vue';
import { useRoute } from 'vue-router';
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
      const route = useRoute()

      const trace = menu => {
        if (menu.childs?.length) {
          for (let child of menu.childs) {
            if (trace(child)) {
              return true
            }
          }
        }

        return [menu.route_or_url, ...(menu.actives || [])].includes(route.name)
      }

      const generate = (menu, attrs = {}) => {
        if (menu.childs?.length) {
          return h(Links, {
            ...attrs,
            menu,
            open,
            active: trace(menu),
          }, menu.childs.map(child => generate(child, {
            ...attrs,
            pl: (attrs.pl || 0) + 1
          })))
        }

        return h(Link, {
          ...attrs,
          menu,
          open,
          active: [menu.route_or_url, ...(menu.actives || [])].includes(route.name),
        })
      }
      
      return h('div', {
        class: 'flex flex-col space-y-1 w-full h-content px-2',
      }, menus.map(menu => generate(menu)))
    }
  },
})
</script>