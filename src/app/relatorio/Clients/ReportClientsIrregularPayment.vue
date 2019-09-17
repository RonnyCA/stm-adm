<template lang="pug">
  #reportClientsIrregularPayment
    report(
      :headers="newHeaders"
      :items="clients"
      :totalPages="pagination.totalPages"
      :paginaAtual="pagination.paginaAtual"
      @update:pagination="setPagination($event)"
      )
      template(
        slot="table-row"
        slot-scope="{ item }"
        )
        td {{ dateFormattedBr(item.data_cadastro) }}
        td {{ item.nome }}
        td {{ item.cpf | cpfOrCnpjMask }}
        td {{ item.celular | telefoneMask }}
        td {{ item.tipo_usuario }}
        td {{ item.forma_pagamento }}
        td {{ item.dias_sem_mensalidade }}
        td.pa-0
          v-btn.pa-0.ml-0(
            outline
            color="primary"
            @click="notificarCliente(item.id)"
            ) Notificar
</template>

<script>
import Report from '@/app/relatorio/Report';
import headers from './HeadersReport';
import moment from 'moment';
import RelatorioService from '@/services/RelatorioService';
import DateFormatte from '@/mixins/date-formatte';
import { cpfOrCnpjMask, telefoneMask } from '@/filters/masks';
import NotificacaoService from '@/services/NotificacaoService';

export default {
  name: 'report-clients-irregular-payment',
  components: {
    Report,
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
    newHeaders: [],
    clients: [],
    pagination: {
      totalPages: 1,
      paginaAtual: 1,
      quantidadePorPagina: 5,
    },
    filters: {
      data: moment().format('YYYY-MM-DD'),
    },
  }),
  created() {
    this.addNewItemsOnHeader()
    this.verificaSeQueryEstaPreenchida();
    this.getClientsForReportIrregularPayment();
  },

  notifications: {
    showErrorMessage: {
      type: 'error',
      title: 'Erro!',
      message: 'Ocorreu um erro ao notificar o cliente!',
    },
  },

  methods: {
    addNewItemsOnHeader() {
      this.newHeaders = [
        ...this.headers,
        {
          text: 'Atraso',
          value: 'dias_sem_mensalidade',
          sortable: true,
          align: 'left',
        },
        {
          text: 'Ações',
          sortable: false,
          align: 'left',
        },
      ];
    },
    verificaSeQueryEstaPreenchida() {
      const { query } = this.$route;
      if (!!query.data) {
        this.filters.data = query.data;
      }

      const { data } = this.filters;
      this
        .$router
        .push({ 'name': 'report-clients-irregular-payment', query: { data } });
    },
    getClientsForReportIrregularPayment() {
      const { paginaAtual, quantidadePorPagina } = this.pagination;
      const { data } = this.filters;
      const params = {
        data,
        ordenacao: 'DataCadastro',
        paginaAtual,
        quantidadePorPagina,
      };
      RelatorioService
        .facade()
        .getClientsForReportIrregularPayment(params)
        .then(({ data }) => {
          const {
            pagina_atual: paginaAtual,
            lista,
          } = data;
          let { pagina_total: paginaTotal } = data;
          paginaTotal = paginaTotal || 1;
          this.pagination.totalPages = paginaTotal;
          this.pagination.paginaAtual = paginaAtual > paginaTotal ? paginaTotal : paginaAtual
          this.clients = data.lista;
        });
    },
    setPagination(event) {
      this.pagination.quantidadePorPagina = event.rowsPerPage;
      this.pagination.paginaAtual = event.page;
    },
    notificarCliente(id) {
      this.$loading.start();
      NotificacaoService
        .facade()
        .enviarNotificacaoAtraso({ id })
        .then(() => {
          const options = {
            title: 'Sucesso',
            text: 'Sucesso ao notificar o cliente!',
            type: 'success',
            confirmButtonText: 'OK',
          };

          this.$loading.finish();
          this.$swal(options);
        })
        .catch(() => {
          this.$loading.finish();
          this.showErrorMessage();
        })
    }
  },
  watch: {
    pagination: {
      handler() {
        this.getClientsForReportIrregularPayment();
      },
      deep:true,
    },
  },
};
</script>
