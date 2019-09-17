<template lang="pug">
  #sidebar
    v-navigation-drawer(
      app
      v-model="drawerVisibility"
      fill-height
      )
      v-toolbar(color="primary")
        v-spacer
        img.py-2(
          src="@/assets/logo-branca.png"
          alt="Smarts App"
          height="100%"
          )
        v-spacer
      v-list(dense)
        template(v-for="(item, index) in links")
          v-list-tile(
            v-if="!hasChildrens(item) && hasPermission(item)"
            @click="notificationExit(item.link)"
            :key="index"
            )
            v-list-tile-action
              v-icon {{ item.icon }}
            v-list-tile-content
              v-list-tile-title {{ item.title }}
          v-list-group(
            v-if="hasChildrens(item) && hasPermission(item)"
            :prepend-icon="item.icon"
            )
            v-list-tile(slot="activator")
              v-list-tile-title {{ item.title }}
            v-list-tile(
              v-for="(children, childKey) in item.children"
              @click="notificationExit(children.link)"
              :key="childKey"
              v-if="hasPermission(children)"
              )
              v-list-tile-action
                v-icon {{ children.icon }}
              v-list-tile-content
                v-list-tile-title {{ children.title }}

      p.version-text.grey--text Versão {{ version }}
</template>

<script>
import SidebarLinks from '@/assets/sidebar-links';
import packageJson from '../../package.json';
import UserService from '@/services/UserService';

export default {
  name: 'Sidebar',

  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    links: SidebarLinks,
  }),

  computed: {
    drawerVisibility: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
    version() {
      return packageJson.version;
    },
    permissions() {
      return UserService.getPermittedModules();
    },
  },

  methods: {
    noticeExit(bota) {
      const options = {
        title: 'Deseja realmente sair desta página? Todo o progresso será perdido',
        type: 'question',
        showCancelButton: true,
        confirmButtonText: 'SIM',
        cancelButtonText: 'NÃO',
        customClass: 'roboto-font',
        confirmButtonClass: 'primary roboto-font',
        cancelButtonClass: 'grey roboto-font',
      };
      this
        .$swal(options)
        .then((result) => {
          if (!result.value) {
            return false;
          }
          return this
            .$router
            .push(bota);
        });
    },
    hasChildrens(item) {
      return !!item.children;
    },
    notificationExit(bota) {
      if (this.$route.params.ofertaId) {
        return this.noticeExit(bota);
      }
      return this.$router.push(bota);
    },
    hasPermission(item) {
      if (item.permission === '') {
        return true;
      }
      return !!this.permissions.find(permission => permission === item.permission);
    },
  },
};
</script>

<style lang="stylus">

.roboto-font
  font-family: Roboto !important
  font-weight: bolder

.version-text
  position absolute
  bottom 0
  width 100%
  text-align center
</style>
