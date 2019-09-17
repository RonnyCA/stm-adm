<template lang="pug">
  #reportReservePendingApprovalPerPlan
    report(
      :paginaAtual="pagination.paginaAtual"
      :headers="headers"
      :items="offers"
      @update:pagination="setPagination($event)"
      :totalPages="pagination.totalPages"
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
        td {{ items.item.nome }}
        td {{ items.item.tipo_cadastro }}
        td {{ items.item.plano }}
        td {{ items.item.celular | telefoneMask }}
        td {{ items.item.reservas_pendentes }}
</template>

<script>
import Report from '../Report.vue';
import Headers from './HeadersReportReservations';
import TableFilters from './TableFilters.vue';
import RelatorioService from '@/services/RelatorioService';
import PlanoService from '@/services/PlanosService';
import { telefoneMask } from '@/filters/masks';
export default {
  name: 'report-reservations-pending-approval-per-plan',

  components: {
    Report,
    TableFilters,
  },

  filters: {
    telefoneMask,
  },

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
    },
  }),

  created() {
    this.checkIfQueryIsFilled();
    this.getOfferForReportReservePendingApprovalPerPlan();
    this.getAllPlan();
  },

  methods: {
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
        .push({ name: 'report-reservations-pending-approval-per-plan', query: { plano: this.filters.plano } });
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
    getOfferForReportReservePendingApprovalPerPlan(){
      this.$loading.start();
      
      const { paginaAtual, quantidadePorPagina } = this.pagination;
      const { plano } = this.filters;
      const params = {
        ordenacao: 'Nome',
        planoId: plano,
        quantidadePorPagina,
        paginaAtual,
      }

      RelatorioService
        .facade()
        .getReportPendingReserve(params)
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
    },
  },

  watch: {
    filters: {
      handler() {
        this.getOfferForReportReservePendingApprovalPerPlan();
      },
      deep: true,
    },
  },
};
</script>
