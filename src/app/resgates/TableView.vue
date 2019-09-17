<template lang="pug">
  #resgates
    .crud-title.pb-4 Resgates/Solicitações de saque
    data-table(
      :hideSearch="true"
      :pagination.sync="pagination"
      :headers="headers"
      :items="resgates"
      :totalPages="pagesSize"
      :disabledActions="true"
      noDataText="Não há solicitações"
      noResultsText="Não foram encontrados resultados"
      :rowsPerPagePossibilites="[5, 10, 30, 50]"
      @changePage="setCurrentPage($event)",
      @changeRowsPerPage="setRowsPerPage($event)"
    )
      template(slot="search")
        table-filters(
          :filters="filters"
          @set-status-solicitacao-resgate="setFilterStatusSolicitacaoResgate($event)"
          @set-plano="setFilterPlano($event)"
          @set-status-pagamento-anunciante="setFilterStatusPagamentoAnunciante($event)"
          )
      template(
        slot="items"
        slot-scope="{ item }"
        )
        td.mouse(:title="item.nome") {{ item.nome }}
        td.mouse(:title="item.telefone | telefoneMask ") {{ item.telefone | telefoneMask }}
        td.mouse(:title="item.celular | telefoneMask") {{ item.celular | telefoneMask }}
        td.mouse(:title="item.tipo_cadastro") {{ item.tipo_cadastro }}
        td.mouse(:title="item.documento | cpfOrCnpjMask") {{ item.documento | cpfOrCnpjMask }}
        td.mouse(:title="item.plano") {{ item.plano }}
        td.mouse(:title="item.status_pagamento") {{ item.status_pagamento }}
        td.mouse(:title="item.status") {{ item.status }}
        td.mouse(:title="item.valor_em_reais | currency") {{ item.valor_em_reais | currency }}
        td.mouse(:title="item.em_espera") {{ item.em_espera }}
        td.mouse(:title="item.conta_bancaria.banco.nome_banco") {{ item.conta_bancaria.banco.nome_banco }}
        td.mouse(:title="item.conta_bancaria.tipo_conta") {{ item.conta_bancaria.tipo_conta }}
        td.mouse(:title="item.conta_bancaria.agencia") {{ item.conta_bancaria.agencia }}
        td.mouse(:title="item.conta_bancaria.conta") {{ item.conta_bancaria.conta }}
        td.pa-0
          v-btn.pa-0.ml-0.green.green--text(v-if="isPago(item)" outline @click="pagar(item, 'Pendente')") PAGO
          v-btn.pa-0.ml-0.red.red--text(v-if="!isPago(item)" outline @click="pagar(item, 'Pago')") PENDENTE
</template>

<script>
import DataTable from '@/components/DataTable.vue';
import headers from './HeadersDataTable';
import ResgateService from '@/services/ResgateService';
import TableFilters from './TableFilters';
import { telefoneMask, cpfOrCnpjMask } from '@/filters/masks';

export default {
  name: 'resgates-data-table',

  components: {
    DataTable,
    TableFilters,
  },

  filters: {
    telefoneMask,
    cpfOrCnpjMask,
  },

  data: () => ({
    headers,
    pagesSize: 1,
    pagination: {
      page: 1,
      rowsPerPage: 5,
    },
    resgates: [],
    filters: {
      status: '',
      planoId: '',
      statusPagamento: '',
    },
  }),

  notifications: {
    showSuccessMessage: {
      type: 'success',
      title: 'Sucesso!',
      message: 'Sucesso ao alterar o status desta solicitação de saque.',
    },
    showErrorMessage: {}
  },

  created() {
    this.getRescue();
  },

  methods: {
    getRescue() {
      this.$loading.start();
      const { filters } = this;
      const {
        rowsPerPage: quantidadePorPagina,
        page: paginaAtual,
      } = this.pagination;
      const options = {
        paginaAtual,
        quantidadePorPagina,
        ...filters,
      };

      ResgateService.facade()
        .findAll(options)
        .then(({ data }) => {
          this.$loading.finish();
          this.resgates = data.lista;
          this.pagesSize = data.pagina_total;
        })
        .catch(({ response }) => {
          this.$loading.finish();
        });
    },
    pagar(item, status) {
      this.$loading.start();

      const payload = {
        id: item.id,
        status,
        versao: item.versao,
      };

      ResgateService.facade()
        .pagarSolicitacaoDeSaque(payload)
        .then(({ data }) => {
          item.status = data.status;
          item.versao = data.versao;
          this.showSuccessMessage();
          this.$loading.finish();
        })
        .catch(({ data }) => {
          this.showErrorMessage({
            type: 'error',
            title: 'Erro!',
            message: data.message,
          });
          this.$loading.finish();
        });
    },
    isPago(item) {
      const { status: statusResgate } = item;
      return statusResgate === 'Pago';
    },
    setFilterPlano(event) {
      this.filters.planoId = event;
    },
    setFilterStatusPagamentoAnunciante(event) {
      this.filters.statusPagamento = event;
    },
    setFilterStatusSolicitacaoResgate(event) {
      this.filters.status = event;
    },
    setCurrentPage(event) {
      this.pagination.page = event;
    },
    setRowsPerPage(event) {
      this.pagination.rowsPerPage = event;
    },
  },
  watch: {
    filters: {
      handler() {
        this.getRescue();
      },
      deep: true,
    },
    pagination: {
      handler() {
        this.getRescue();
      },
      deep: true,
    }
  }
};
</script>
