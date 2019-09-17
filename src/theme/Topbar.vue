<template lang="pug">
  #topbar
    v-toolbar(
      app
      dark
      fixed
      color="primary"
      )
      v-toolbar-side-icon(@click.stop="toggleSidebar()")
      v-spacer
      v-btn(
        flat
        icon
        @click.stop="notificationExit()"
        )
        v-icon power_settings_new
</template>

<script>
import LoginService from '@/services/LoginService';

export default {
  name: 'topbar',

  methods: {
    noticeExit() {
      const options = {
        title: 'Deseja realmente sair?',
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
          return this.doLogout();
        });
    },
    toggleSidebar() {
      this.$emit('toggle-sidebar');
    },
    goToLogin() {
      return this
        .$router
        .replace('/login');
    },
    notificationExit() {
        return this.noticeExit();
    },
    doLogout() {
      LoginService.doLogout();
      this.goToLogin();
    },

  },
};
</script>
