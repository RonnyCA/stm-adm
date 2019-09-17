<template lang="pug">
  #reportClientsRegistered
    .crud-title.pb-4 Relatório clientes
    report(
      :headers="headers"
      :items="clients"
      :totalPages="pagination.totalPages"
      :paginaAtual="pagination.paginaAtual"
      @update:pagination="setPagination($event)"
      )
      template(slot="filters")
        table-filters(
          :tiposUsuarios="tiposUsuarios"
          :filters="filters"
          @set-filter-tipo-usuario="setFilterTipoUsuario($event)"
          )
      template(
        slot="table-row"
        slot-scope="items"
        )
        td {{ dateFormattedBr(items.item.data_cadastro) }}
        td {{ items.item.nome }}
        td {{ items.item.cpf | cpfOrCnpjMask }}
        td {{ items.item.celular | telefoneMask }}
        td {{ items.item.tipo_usuario }}
        td {{ items.item.forma_pagamento }}
</template>

<script>
import Report from '@/app/relatorio/Report';
import headers from './HeadersReport';
import moment from 'moment';
import RelatorioService from '@/services/RelatorioService';
import DateFormatte from '@/mixins/date-formatte';
import { cpfOrCnpjMask, telefoneMask } from '@/filters/masks';
import TableFilters from './TableFilters';

export default {
  name: 'report-clients-registered',
  components: {
    Report,
    TableFilters,
  },
  mixins: [
    DateFormatte,
  ],
  filters: {
    cpfOrCnpjMask,
    telefoneMask,
  },
  data: () => ({
    headers,
    clients: [],
    pagination: {
      quantidadePorPagina: 5,
      paginaAtual: 1,
      totalPages: 1,
    },
    tiposUsuarios: [
      { text: 'Todos', value: 'Todos' },
      { text: 'Cliente Smart', value: 'Smart' },
      { text: 'Cliente Smart Premium', value: 'Premium' },
    ],
    filters: {
      data: moment().format('YYYY-MM-DD'),
      tipoUsuario: 'Todos',
    },
  }),
  created() {
    this.verificaSeQueryEstaPreenchida();
    this.getClientsForReportRegisteredAndActive();
  },
  methods: {
    verificaSeQueryEstaPreenchida() {
      const { query } = this.$route;
      if (!!query.data) {
        this.filters.data = query.data;
      }

      if (query.tipoUsuario) {
        this.filters.tipoUsuario = query.tipoUsuario;
      }

      const {
        data,
        tipoUsuario,
      } = this.filters;
      this
        .$router
        .push({ name: 'report-clients-registered-and-active', query: { data, tipoUsuario } });
    },
    getClientsForReportRegisteredAndActive() {
      this.$loading.start();
      const { paginaAtual, quantidadePorPagina } = this.pagination;
      const { data, tipoUsuario } = this.filters;
      const params = {
        data,
        ordenacao: 'DataCadastro',
        paginaAtual,
        quantidadePorPagina,
        tipoUsuario,
      };
      RelatorioService
        .facade()
        .getClientsForReportRegisteredAndActive(params)
        .then(({ data }) => {
          const {
            pagina_atual: paginaAtual,
            lista,
          } = data;
          let { pagina_total: paginaTotal } = data;
          paginaTotal = paginaTotal || 1;
          this.pagination.totalPages = paginaTotal;
          this.pagination.paginaAtual = paginaAtual > paginaTotal ? paginaTotal : paginaAtual;
          this.clients = lista;
          this.$loading.finish();
        });
    },
    setPagination(event) {
      this.pagination.quantidadePorPagina = event.rowsPerPage;
      this.pagination.paginaAtual = event.page;
    },
    setFilterTipoUsuario(event) {
      this.filters.tipoUsuario = event;
    },
  },
  watch: {
    pagination: {
      handler() {
        this.getClientsForReportRegisteredAndActive();
      },
      deep: true,
    },
    filters: {
      handler() {
        const {
          data,
          tipoUsuario,
        } = this.filters;
        this
          .$router
          .push({ name: 'report-clients-registered-and-active', query: { data, tipoUsuario } });
        this.getClientsForReportRegisteredAndActive();
      },
      deep: true,
    },
  },
};
</script>
