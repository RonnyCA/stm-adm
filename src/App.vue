<template lang="pug">
  v-app#app
    app-loading
    router-view
</template>

<script>
import AppLoading from '@/components/AppLoading.vue';

export default {
  name: 'app',

  components: {
    AppLoading,
  },
};
</script>

<style lang="stylus">
.crud-title
  font-size 16px
  font-weight 400
  color rgb(97, 97, 97)

</style>
