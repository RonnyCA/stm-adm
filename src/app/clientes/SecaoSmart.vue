<template lang="pug">
  #secaoSmart
    .crud-title.py-4 Seção Smarts
       v-card
        v-card-text
          v-layout(row wrap)
            .body-2.py-1 Smarts total: {{ smartAcumulado | monetarySmartsFilter }}
          v-layout(row wrap)
            .body-2.py-1 Smarts recebidos: {{ smartRecebido | monetarySmartsFilter }}
          v-layout(row wrap)
            .body-2.py-1 Smarts utilizados: {{ smartUtilizado | monetarySmartsFilter }}
</template><script>

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
      return this.value.smarts;
    },
    smartRecebido() {
      return this.value.smarts_recebidos;
    },
    smartUtilizado() {
      return this.value.smarts_utilizados;
    },
  },
  filters: {
    monetarySmartsFilter,
  },
};
</script>
