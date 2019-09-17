<template lang="pug">
  #ofertas
    .crud-title.pb-4 Ofertas
      v-card
        offer-tabs
</template>

<script>
import OfferTabs from './OfferTabs.vue';

export default {
  name: 'usuarios-data-table',

  components: {
    OfferTabs,
  },
};
</script>

