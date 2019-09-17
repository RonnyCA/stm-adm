<template lang="pug">
  v-container#resgatesTableFilters(grid-list-md)
    v-layout(row wrap)
      v-flex(
        xs12
        md4
        )
        v-autocomplete(
          label="Status da solicitação de resgate"
          v-model="statusSolicitacaoResgate"
          :items="statusResgate"
          clearable
          )
      v-flex(
        xs12
        md4
        )
        v-autocomplete(
          label="Planos"
          v-model="plano"
          :items="planos"
          clearable
          )
      v-flex(
        xs12
        md4
        )
        v-autocomplete(
          label="Status pagamento anunciante"
          v-model="statusPagamentoAnunciante"
          :items="statusPagamento"
          clearable
          )
</template>

<script>
import PlanosService from '@/services/PlanosService';

export default {
  name: 'resgates-table-filters',
  props: {
    filters: {
      type: Object,
    },
  },
  data: () => ({
    planos: [],
    statusPagamento: [
      {
        text: 'Regular',
        value: 'Regular',
      },
      {
        text: 'Irregular',
        value: 'Irregular',
      },
    ],
    statusResgate: [
      {
        text: 'PAGO',
        value: 'Pago',
      },
      {
        text: 'PENDENTE',
        value: 'Pendente',
      },
    ],
  }),
  created() {
    this.getPlanos();
  },
  computed: {
    plano: {
      get() {
        const { planoId } = this.filters;
        return planoId;
      },
      set(value) {
        this.$emit('set-plano', value);
      },
    },
    statusPagamentoAnunciante: {
      get() {
        const { statusPagamento } = this.filters;
        return statusPagamento;
      },
      set(value) {
        this.$emit('set-status-pagamento-anunciante', value);
      },
    },
    statusSolicitacaoResgate: {
      get() {
        const { status } = this.filters;
        return status;
      },
      set(value) {
        this.$emit('set-status-solicitacao-resgate', value);
      },
    },
  },
  methods: {
    getPlanos() {
      PlanosService
        .facade()
        .getPlans()
        .then(({ data }) => {
          data.map(({ titulo, id }) => {
            this.planos.push({
              text: titulo,
              value: id,
            });
          });
        });
    },
  },
};
</script>
