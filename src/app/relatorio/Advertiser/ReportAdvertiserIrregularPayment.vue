<template lang="pug">
  #reportAdvertiserIrregularPayment
    report(
      :headers="headers"
      :items="advertisers"
      :totalPages="pagination.totalPages"
      @update:pagination="setPagination($event)"
      )
      template(slot="filters")
        table-filters(
          :planos="planos"
          v-model="filters"
          :categorias="categorias"
          @set-filter="setFiltersType($event)"
          :tipoAnunciante="tiposAnunciantes"
          @set-filter-plan="setFiltersPlan($event)"
          @set-filter-category="setFiltersCategory($event)"
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
import Headers from './HeadersReport'
import TableFilters from './TableFilters.vue';
import { telefoneMask } from '@/filters/masks';
import DateFormatte from '@/mixins/date-formatte';
import RelatorioService from '@/services/RelatorioService';
import CategoriaService from '@/services/CategoriaService';
import PlanoService from '@/services/PlanosService';

export default {
  name: 'report-advertiser-irregular-payment',

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
      { value: 'Todos', text: 'Todos' },
      { value: 'Smart', text: 'Anunciante Smart' },
      { value: 'Premium', text: 'Anunciante Smart Premium' },
    ],
    filters: {
      categoria: null,
      plano: null,
      tipoAnunciante: 'Todos', 
      data: moment().format('YYYY-MM-DD'),
    },
    planos: [],
    categorias: [],
    plano: null,
    categoria: null,
    pagination: {
      quantidadePorPagina: 5,
      paginaAtual: 1,
      totalPages: 1,
    },
  }),

  created() {
    this.verificaSeQueryEstaPreenchida();
    this.getAdvertiserForReportIrregularPayment();
    this.getAllPlan();
    this.getAllCategory();
  },

  methods: {
    verificaSeQueryEstaPreenchida() {
      const { query } = this.$route;
      if (!!query.data) {
        this.filters.data = query.data;
      }
      if (!!query.categoria) {
        this.filters.categoria = query.categoria;
      }
      if (!!query.plano) {
        this.filters.plano = query.plano;
      }
      const queryString = {
        data: this.filters.data,
        ...this.filters,
      }
      this
        .$router
        .push({ name: 'report-advertiser-irregular-payment', query: queryString });
    },
    getAllPlan() {
      this.$loading.start();

      PlanoService
        .facade()
        .getPlans()
        .then(({ data }) => {
          data.map((plano) => {
            this.planos.push({
              text: plano.titulo,
              value: plano.id
            });
          })
        })
        .catch(() => {
          this.showError({
            type: 'error',
            title: 'Não foi possível trazer os dados dos planos',
          });
          this.$loading.finish();
        });
    },
    getAllCategory() {
      this.$loading.start();
      
      CategoriaService
        .facade()
        .findAllWithoutPaginate()
        .then(({ data }) => {
          data.map((categoria) => {
            this.categorias.push({
              text: categoria.titulo,
              value: categoria.id
            });
            this.$loading.finish();
          })
        })
        .catch(() => {
          this.showError({
            type: 'error',
            title: 'Não foi possível trazer os dados das categorias',
          });
          this.$loading.finish();
        })
    },
    getAdvertiserForReportIrregularPayment() {
      this.$loading.start();

      const { paginaAtual, quantidadePorPagina } = this.pagination;
      const { categoria, plano, data } = this.filters;
      const params = {
        data: data,
        tipoAnunciante: this.filters.tipoAnunciante,
        ordenacao: 'DataCadastro',
        statusCadastro: 'Default',
        paginaAtual,
        quantidadePorPagina,
        categoria,
        idPlano: plano,
      };

      RelatorioService
        .facade()
        .getAdvertiserReport(params)
        .then(({ data }) => {
          this.pagination.totalPages = data.pagina_total;
          this.advertisers = data.lista;
          this.$loading.finish();
        })
        .catch(({ data, status }) => {
          if(status === 500) {
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
    },
    setFiltersPlan(event) {
      this.filters.plano = event;
    },
    setFiltersCategory(event) {
      this.filters.categoria = event;
    },
  },
  watch: {
    pagination: {
      handler() {
        this.getAdvertiserForReportIrregularPayment();
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
          .push({ name: 'report-advertiser-irregular-payment', query: queryString });
        this.getAdvertiserForReportIrregularPayment();
      },
      deep: true,
    },
  },
};
</script>

