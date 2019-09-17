<template lang="pug">
  #reportAdvertiserPendingApproval
    report(
      :headers="headers"
      :items="advertisers"
      @update-pagination="setPagination($event)"
      :totalPages="pagination.totalPages"
      )
      template(slot="filters")
        table-filters(
          v-model="filters"
          @set-filter="setFiltersType($event)"
          :tipoAnunciante="tiposAnunciantes"
          )
      template(
        slot="table-row"
        slot-scope="items"
        )
        td.hand-mouse(@click="goToPreview(items.item)") {{ dateFormattedBr(items.item.data_cadastro) }}
        td.hand-mouse(@click="goToPreview(items.item)") {{ items.item.nome }}
        td.hand-mouse(@click="goToPreview(items.item)") {{ items.item.celular | telefoneMask }}
        td.hand-mouse(@click="goToPreview(items.item)") {{ items.item.tipo_usuario }}
        td.hand-mouse(@click="goToPreview(items.item)") {{ items.item.tipo_cadastro }}
        td.hand-mouse(@click="goToPreview(items.item)") {{ items.item.plano }}
        td.hand-mouse(@click="goToPreview(items.item)") {{ items.item.categoria }}
        td.hand-mouse(@click="goToPreview(items.item)") {{ items.item.segmento }}
        td.hand-mouse(@click="goToPreview(items.item)") {{ items.item.forma_de_pagamento }}
</template>

<script>
import RelatorioService from '@/services/RelatorioService';
import Headers from './HeadersReport'
import Report from '../Report.vue';
import moment from 'moment';
import TableFilters from './TableFilters.vue';
import { telefoneMask } from '@/filters/masks';
import DateFormatte from '@/mixins/date-formatte';

export default {
  name: 'report-advertiser-pending-approval',

  components: {
    Report,
    TableFilters,
  },

  mixins: [DateFormatte],

  filters: {
    telefoneMask,
  },

  notifications: {
    showError: {},
  },

  data: () => ({
    headers: Headers,
    advertisers: [],
    tiposAnunciantes: [
      { value: 'Smart', text: 'Anunciante Smart' },
      { value: 'Premium', text: 'Anunciante Smart Premium' },
    ],
    filters: {
      tipoAnunciante: 'Smart',
      data: moment().format('YYYY-MM-DD'),      
    },
    pagination: {
      quantidadePorPagina: 5,
      paginaAtual: 1,
      totalPages: 1,
    },
  }),

  created() {
    this.getAdvertiserForReportPendingApproval();
  },

  methods: {
    goToPreview(item) {
      this
        .$router
        .push(`/anunciantes/${item.id}/detalhes`);
    },
    getAdvertiserForReportPendingApproval() {
      this.$loading.start();

      const { paginaAtual, quantidadePorPagina } = this.pagination
      const { data } = this.filters;
      const params = {
        data: data,
        tipoAnunciante: this.filters.tipoAnunciante,
        ordenacao: 'DataCadastro',
        paginaAtual,
        quantidadePorPagina,
      };

      RelatorioService
        .facade()
        .getAdvertiserReportPending(params)
        .then(({ data }) => {
          this.pagination.totalPages = data.pagina_total;
          this.advertisers = data.lista;
          this.$loading.finish();
        })
        .catch(({status}) => {
          if (status === 500) {
            this.showError({
              type: 'error',
              title: 'Não foi possível exibir a listagem',
            });
          }
          this.$loading.finish();
        });
    },
    setPagination(event) {
      this.pagination.quantidadePorPagina = event.rowsPerPage;
      this.pagination.paginaAtual = event.page;
    },
    setFiltersType(event) {
      this.filters.tipoAnunciante = event;
      this.getAdvertiserForReportPendingApproval();
    },
  },
  watch: {
    pagination: {
      handler() {
        this.getAdvertiserForReportPendingApproval();
      },
      deep: true,
    },
  },
};
</script>

<style lang="stylus">
.hand-mouse
  cursor pointer
</style>
