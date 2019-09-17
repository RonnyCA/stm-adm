<template lang="pug">
  #reportAdvertiserRegistered
    report(
      :paginaAtual="pagination.paginaAtual"
      :headers="headers"
      :items="advertisers"
      @update:pagination="setPagination($event)"
      :totalPages="pagination.totalPages"
      )
      template(slot="filters")
        table-filters(
          v-model="filters"
          @set-filter="setFiltersAndGetDados($event)"
          :tipoAnunciante="tiposAnunciantes"
          )
      template(
        slot="table-row" 
        slot-scope="items"
        )
        td {{ dateFormattedBr(items.item.data_casdastro) }}
        td {{ items.item.nome }}
        td {{ items.item.celular | telefoneMask }}
        td {{ items.item.tipo_usuario }}
        td {{ items.item.tipo_cadastro }}
        td {{ items.item.plano }}
        td {{ items.item.categoria }}
        td {{ items.item.segmento }}
        td {{ items.item.forma_de_pagamento }}
</template>

<script>
import moment from 'moment';
import Report from '../Report.vue';
import Headers from './HeadersReport'
import RelatorioService from '@/services/RelatorioService';
import DateFormatte from '@/mixins/date-formatte';
import TableFilters from './TableFilters.vue';
import { telefoneMask } from '@/filters/masks';

export default {
  name: 'report-advertiser-registered',

  mixins: [DateFormatte],

  filters: {
    telefoneMask,
  },

  components: {
    Report,
    TableFilters,
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
    this.verificaSeQueryEstaPreenchida();
    this.getAdvertiserForReportRegisteredActive();
  },

  methods: {
    verificaSeQueryEstaPreenchida() {
      const { query } = this.$route;
      if (!!query.data) {
        this.filters.data = query.data;
      }
      if (!!query.tipoAnunciante) {
        this.filters.tipoAnunciante = query.tipoAnunciante;
      }
      const queryString = {
        data: this.filters.data,
        ...this.filters,
      }
      this
        .$router
        .push({ name: 'report-advertiser-registered', query: queryString });
    },
    setPagination(event) {
      this.pagination.quantidadePorPagina = event.rowsPerPage;
      this.pagination.paginaAtual = event.page;
    },
    getAdvertiserForReportRegisteredActive() {
      this.$loading.start();
      
      const { paginaAtual, quantidadePorPagina } = this.pagination
      const { tipoAnunciante, data } = this.filters;
      const params = {
        data,
        tipoAnunciante: tipoAnunciante,
        ordenacao: 'DataCadastro',
        paginaAtual,
        quantidadePorPagina,
      };
      
      RelatorioService
        .facade()
        .getAdvertiserReport(params)
        .then(({ data }) => {
          const {
            pagina_total: paginaTotal,
            pagina_atual: paginaAtual,
            lista,
          } = data
          this.pagination.totalPages = paginaTotal;
          this.pagination.paginaAtual = paginaAtual > paginaTotal ? paginaTotal : paginaAtual
          this.pagination.totalPages = data.pagina_total;
          this.advertisers = lista;
          this.$loading.finish();
        })
        .catch(({ data, status }) => {
          if (status === 500) {
            this.showError({
              type: 'error',
              title: 'Não foi possível exibir a listagem',
            });
          }
          this.$loading.finish();
        });
    },
    setFiltersAndGetDados(event) {
      this.filters.tipoAnunciante = event;
      this.getAdvertiserForReportRegisteredActive();
    }
  },
  watch: {
    pagination: {
      handler() {
        this.getAdvertiserForReportRegisteredActive();
      },
      deep: true,
    },
    filters: {
      handler() {
        const queryString = {
          data: this.filters.data,
          ...this.filters,
        }
        this
          .$router
          .push({ name: 'report-advertiser-registered', query: queryString });
        this.getAdvertiserForReportRegisteredActive();
      },
      deep: true,
    },
  },
};
</script>

