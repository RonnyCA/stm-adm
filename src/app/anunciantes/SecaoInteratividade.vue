<template lang="pug">
  #secaoInteratividade
    .crud-title.py-4 Seção Interações
    v-card
      v-card-text
        v-layout(row wrap)
          .body-2.py-1 Total Ofertas Publicadas: {{ ofertasPublicadas }}
        v-layout(row wrap)
          .body-2.py-1 Total Vendas Balcão: {{ ofertasVendaBalcao }}
        v-layout(row wrap)
          .body-2.py-1 Total Vendas Balcão e Ofertas Publicadas: {{ ofertasPublicadasAndTotalVendasBalcao }}
</template>

<script>
export default {
  name: 'secao-interatividade',

  props: {
    value: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ofertasPublicadas() {
      const { publicacao } = this.value;
      return publicacao;
    },
    ofertasVendaBalcao() {
      const { venda_balcao: vendaBalcao } = this.value;
      return vendaBalcao;
    },
    ofertasPublicadasAndTotalVendasBalcao() {
      const { ofertasPublicadas, ofertasVendaBalcao } = this;
      return parseInt(ofertasPublicadas) + parseInt(ofertasVendaBalcao);
    },
  },
};
</script>
