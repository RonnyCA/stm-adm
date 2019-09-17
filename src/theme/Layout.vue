<template lang="pug">
  #layout
    topbar(@toggle-sidebar="toggleSidebar()")
    sidebar(v-model="sidebarVisible")
    v-content
      v-container(
        fluid
        fill-height
        )
        router-view
</template>

<script>
import Topbar from '@/theme/Topbar.vue';
import Sidebar from '@/theme/Sidebar.vue';

export default {
  name: 'layout',

  components: {
    Topbar,
    Sidebar,
  },

  data: () => ({
    sidebarVisible: true,
  }),

  methods: {
    toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible;
    },
  },
};
</script>

