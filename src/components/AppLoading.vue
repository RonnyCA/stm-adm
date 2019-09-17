<template lang="pug">
  #app-loading(v-if="loading")
    v-progress-linear.ma-0(
      ref="loading"
      color="accent"
      height="5"
      indeterminate
      )
</template>

<script>
import Vue from 'vue';

export default {
  name: 'app-loading',

  data: () => ({
    loading: false,
  }),

  computed: {
    isLoading() {
      return this.loading;
    },
  },

  created() {
    Vue
      .prototype
      .$loading = this;
  },

  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    },
  },
};
</script>

<style lang="stylus">
#app-loading
  position fixed
  z-index 11
  top 0
  right 0
  bottom 0
  left 0
</style>
