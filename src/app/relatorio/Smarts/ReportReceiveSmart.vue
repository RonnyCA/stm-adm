<template lang="pug">
  #reportPaymentPendingByPlan
    report(
      :paginaAtual="pagination.paginaAtual"
      :headers="headers"
      :items="smarts"
      :totalPages="pagination.totalPages"
      @update:pagination="setPagination($event)"
      )
      template(slot="filters")
        table-filters(
          v-model="filters"
          :planos="planos"
          :categorias="categorias"
          @set-filter-plan="setFiltersPlan($event)"
          @set-filter-category="setFiltersCategory($event)"
          )
      template(
        slot="table-row"
        slot-scope="items"
        )
        td {{ dateFormattedBr(items.item.data_cadastro) }}
        td {{ items.item.nome }}
        td {{ items.item.documento | cpfOrCnpjMask}}
        td {{ items.item.celular | telefoneMask}}
        td {{ items.item.tipo_de_cadastro }}
        td {{ items.item.plano }}
        td {{ items.item.categoria }}
        td {{ items.item.forma_de_pagamento }}
        td {{ items.item.valor }}
</template>

<script>
import Report from '../Report.vue';
import TableFilters from './TableFilters.vue';
import HeadersReportSmart from './HeadersReportSmart';
import moment from 'moment';
import RelatorioService from '@/services/RelatorioService';
import { telefoneMask, cpfOrCnpjMask } from '@/filters/masks';
import CategoriaService from '@/services/CategoriaService';
import PlanoService from '@/services/PlanosService';
import DateFormatte from '@/mixins/date-formatte';

export default {
  name: 'report-receive-smart',

  components: {
    Report,
    TableFilters,
  },

  filters: {
    telefoneMask,
    cpfOrCnpjMask,
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
    smarts: [],
    planos: [],
    categorias: [],
    filters: {
      plano: null,
      categoria: null,
      data: moment().format('YYYY-MM-DD'),
    },
    pagination: {
      quantidadePorPagina: 5,
      paginaAtual: 1,
      totalPages: 1,
    },
  }),

  created() {
    this.verifyIfQueryFilled();
    this.getAllPlan();
    this.getAllCategory();
    this.getSmartForReportReceiveSmart();
  },

  methods: {
    verifyIfQueryFilled() {
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
        .push({ name: 'report-receive-smart', query: queryString });
    },
    setPagination(event) {
      this.pagination.quantidadePorPagina = event.rowsPerPage;
      this.pagination.paginaAtual = event.page;
    },
    setFiltersPlan(event) {
      this.filters.plano = event;
    },
    setFiltersCategory(event) {
      this.filters.categoria = event;
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
    getSmartForReportReceiveSmart() {
      this.$loading.start();

      const { paginaAtual, quantidadePorPagina } = this.pagination;
      const { plano, categoria, data, statusSaque } = this.filters;
      const params = {
        data,
        planoId: plano,
        categoriaId: categoria,
        statusSaque: statusSaque, 
        quantidadePorPagina,
        paginaAtual,
      }

      RelatorioService
        .facade()
        .getReportReceiveSmarts(params)
        .then(({ data }) => {
          this.smarts = data.lista;
          this.pagination.totalPages = data.pagina_total;
          this.$loading.finish();
        })
        .catch(() => {
          this.showError();
          this.$loading.finish();
        });
    },
  },

  watch: {
    pagination: {
      handler() {
        this.getSmartForReportReceiveSmart();
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
          .push({ name: 'report-receive-smart', query: queryString });
        this.getSmartForReportReceiveSmart();
      },
      deep: true,
    },
  },
};
</script>
