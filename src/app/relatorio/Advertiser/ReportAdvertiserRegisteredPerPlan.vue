<template lang="pug">
  #reportAdvertiserRegisteredPerPlan
    report(
      :headers="headers"
      :items="advertisers"
      @update:pagination="setPagination($event)"
      :totalPages="pagination.totalPages"
      )
      template(slot="filters")
        table-filters.pa-0(
          v-model="filters"
          @set-filter="setFiltersType($event)"
          :planos="planos"
          @set-filter-plan="setFilterPlan($event)"
          )
      template(
        slot="table-row"
        slot-scope="items"
        )
        td {{ dateFormattedBr(items.item.data_cadastro) }}
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
import Headers from './HeadersReport';
import RelatorioService from '@/services/RelatorioService';
import PlanoService from '@/services/PlanosService';
import DataFormatte from '@/mixins/date-formatte';
import TableFilters from './TableFilters.vue';
import { telefoneMask } from '@/filters/masks';

export default {
  name: 'report-advertiser-registered-per-plan',

  mixins: [DataFormatte],

  props: {
    status: {
      type: Boolean,
      default: false,
    },
  },

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
    headers : Headers,
    advertisers: [],
    planos: [],
    filters: {
      plano: null,
      tipoAnunciante: 'Todos',
    },
    data: moment().format('YYYY-MM-DD'),
    ativo: false,
    pagination: {
      quantidadePorPagina: 5,
      paginaAtual: 1,
      totalPages: 1,
    },
  }),

  created() {
    this.checkIfQueryIsFilled();
    this.getAllPlan();
    this.getAdvertiserForReportRegisteredPerPlan();
  },

  methods: {
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
        .catch(( { data }) => {
          if ( status === 500) {
            this.showError({
              type: 'error',
              title: 'Não foi possível exibir a listagem',
            });
          }
          this.$loading.finish();
        });
    },
    checkIfQueryIsFilled() {
      const { query } = this.$route;
      if (!!query.data) {
        this.data = query.data;
      }
      if (!!query.ativo) {
        this.ativo = query.ativo;
      }
      this
        .$router
        .push({ name: 'report-advertiser-registered-per-plan', query: { data: this.data, ativo: this.ativo } });
    },
    getAdvertiserForReportRegisteredPerPlan() {
      this.$loading.start();

      const { paginaAtual, quantidadePorPagina } = this.pagination
      const { ativo } = this
      const params = { 
        data: this.data,
        tipoAnunciante: this.filters.tipoAnunciante,
        ordenacao: 'DataCadastro',
        statusCadastro: 'Default',
        paginaAtual,
        quantidadePorPagina,
        ativo,
        idPlano: this.plano,
      };

      RelatorioService
        .facade()
        .getAdvertiserReport(params)
        .then(({ data }) => {
          this.pagination.totalPages = data.pagina_total;
          this.advertisers = data.lista;
          this.$loading.finish();
        })
        .catch(({ status }) => {
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
      this.getAdvertiserForReportRegisteredPerPlan();
    },
    setFilterPlan(event) {
      this.filters.plano = event;
      this.getAdvertiserForReportRegisteredPerPlan();      
    },
  },
  watch: {
    pagination: {
      handler() {
        this.getAdvertiserForReportRegisteredPerPlan();
      },
      deep: true,
    },
  },
};
</script>

