<template lang="pug">
  #secaoSmart
    .crud-title.py-4 Seção Smart
    v-card
      v-card-text
        v-layout(row wrap)
          .body-2.py-1 Smarts cedidos: {{ smartCedidos | monetarySmartsFilter }}
        v-layout(row wrap)
          .body-2.py-1 Smarts recebidos: {{ smartRecebido | monetarySmartsFilter }}
        v-layout(row wrap)
          .body-2.py-1 Total smarts: {{ smartAcumulado | monetarySmartsFilter }}
</template>

<script>

import {monetarySmartsFilter} from '@/filters/monetary'

export default {
  name: 'secao-smart',

  props: {
    value: {
      type: Object,
      required: true,
    },
  },

  computed: {
    smartAcumulado() {
      return this.value.smarts_total;
    },
    smartRecebido() {
      return this.value.smarts_recebidos;
    },
    smartCedidos() {
      return this.value.smarts_cedidos;
    },
  },
  filters: {
    monetarySmartsFilter,
  },
};
</script>
