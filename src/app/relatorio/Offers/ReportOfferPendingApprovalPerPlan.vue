<template lang="pug">
  #reportOfferPendingApprovalPerPlan
    report(
      :paginaAtual="pagination.paginaAtual"
      :headers="headers"
      :items="offers"
      :totalPages="pagination.totalPages"
      @update-pagination="setPagination($event)"
      )
      template(slot="filters")
        table-filters(
          v-model="filters"
          @set-filter-plan="setFiltersPlan($event)"
          :planos="planos"
          )
      template(
        slot="table-row"
        slot-scope="items"
        )
        td.hand-mouse(@click="goToPreview(items.item)") {{ items.item.produto }}
        td.hand-mouse(@click="goToPreview(items.item)") {{ items.item.valor }}
        td.hand-mouse(@click="goToPreview(items.item)") {{ items.item.desconto }}
        td.hand-mouse(@click="goToPreview(items.item)") {{ items.item.smarts }}
        td.hand-mouse(@click="goToPreview(items.item)") {{ items.item.anunciante }}
        td.hand-mouse(@click="goToPreview(items.item)") {{ items.item.plano }}
        td.hand-mouse(@click="goToPreview(items.item)") {{ dateFormattedBr(items.item.aguardando_aprovacao) }}
</template>

<script>
import Report from '../Report.vue';
import Headers from './HeadersReport'
import TableFilters from './TableFilters.vue';
import RelatorioService from '@/services/RelatorioService';
import PlanoService from '@/services/PlanosService';
import DateFormatte from '@/mixins/date-formatte';

export default {
  name: 'report-offer-pending-approval-per-plan',
  
  components: {
    Report,
    TableFilters,
  },

  mixins: [DateFormatte],

  notifications: {
    showError: {
      title: 'Deu ruim',
      message: 'Ocorreu um erro ao tentar pegar os dados do mockAPI!!',
      type: 'error',
    },
  },

  data: () => ({
    headers: Headers,
    offers: [],
    planos: [],
    filters: {
      plano: null,
    },
    pagination: {
      quantidadePorPagina: 5,
      paginaAtual: 1,
      totalPages: 1,
    }
  }),

  created() {
    this.checkIfQueryIsFilled();
    this.getOfferForReportPendingApprovalPerPlan();
    this.getAllPlan();
  },

  methods: {
    goToPreview(item) {
      this
        .$router
        .push(`/ofertas/${item.id}/detalhes`)
    },
    checkIfQueryIsFilled() {
      const { query } = this.$route;
      if (!!query.plano) {
        this.filters.plano = query.plano;
      }
      this.setQueryString();
    },
    setQueryString() {
      this
        .$router
        .push({ name: 'report-offer-pending-approval-per-plan', query: { plano: this.filters.plano } });
    },
    getAllPlan() {
      this.$loading.start();

      PlanoService
        .facade()
        .getPlans()
        .then(( { data }) => {
          data.map((plano) => {
            this.planos.push({
              text: plano.titulo,
              value: plano.id
            });
          })
        })
        .catch(() => {
          this.showError();
          this.$loading.finish();
        });
    },
    getOfferForReportPendingApprovalPerPlan() {
      this.$loading.start();

      const { paginaAtual, quantidadePorPagina } = this.pagination;
      const { plano } = this.filters;
      const params = {
        ordenar: 'Produto',
        paginaAtual,
        quantidadePorPagina,
        planoId: plano,
      };

      RelatorioService
        .facade()
        .getOfferReport(params)
        .then(({ data }) => {
          this.offers = data.lista;
          this.pagination.totalPages = data.pagina_total;
          this.$loading.finish();
        })
        .catch(() => {
          this.showError();
          this.$loading.finish();
        });
    },
    setPagination(event) {
      this.pagination.quantidadePorPagina = event.rowsPerPage;
      this.pagination.paginaAtual = event.page;
    },
    setFiltersPlan(event) {
      this.filters.plano = event;
      this.setQueryString();
      this.getOfferForReportPendingApprovalPerPlan();
    },
  },
  watch: {
    pagination: {
      handler() {
        this.getOfferForReportPendingApprovalPerPlan();
      },
      deep: true,
    },
  },
}
</script>

<style lang="stylus">
.hand-mouse
  cursor pointer
</style>
