<template lang="pug">
  #secaoSmart
    .crud-title.py-4 Seção Interações
       v-card
        v-card-text
          v-layout(row wrap)
            .body-2.py-1 Número total de curtidas: {{ numeroCurtidas }}
          v-layout(row wrap)
            .body-2.py-1 Número total de favoritações: {{ numeroFavoritacoes }}
          v-layout(row wrap)
            .body-2.py-1 Número total de compras: {{ totalCompras }}
</template>

<script>
export default {
  name: 'secao-smart',

  props: {
    value: {
      type: Object,
      required: true,
    },
  },

  computed: {
    numeroCurtidas() {
      return this.value.numero_total_de_curtidas;
    },
    numeroFavoritacoes() {
      return this.value.numero_total_de_favoritacao;
    },
    totalCompras() {
      return this.value.numero_total_de_compras;
    },
  },
};
</script>

