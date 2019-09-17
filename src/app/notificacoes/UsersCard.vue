<template lang="pug">
  #notificacoesFormView
    .crud-title.py-4 Usuários
    data-table(
      :headers="headers"
      :items="usuarios"
      :pagination.sync="pagination"
      :disabledActions="true"
      :totalPages="pagesSize"
      :search="filters.termo"
      noDataText="Não foram encontrados resultados"
      noResultsText="Não foram encontrados resultados"
      @search="setSearchTerm($event)"
      @changePage="setCurrentPage($event)",
      @changeRowsPerPage="setRowsPerPage($event)"
      :enableCheckbox="true"
      @updateCheckBox="updateCheckBox()"
      )
      template(slot="search")
        table-filters(
          :filters="filters"
          @set-filters="setFilters($event)"
          )
      template(
        slot="items"
        slot-scope="{ item }"
        )
        td {{ item.data_cadastro | dateFormatteBR }}
        td {{ item.nome }}
        td {{ item.celular | telefoneMask }}
        td {{ item.email }}
        td
          v-checkbox.pt-3(
            color="primary"
            v-model="item.enviarNotificacao"
            )
</template>

<script>
import DataTable from '@/components/DataTable';
import headers from './HeadersDataTable';
import NotificacaoService from '@/services/NotificacaoService';
import { telefoneMask } from '@/filters/masks';
import { dateFormatteBR } from '@/filters/date-formatte';
import TableFilters from './TableFilters';

export default {
  name: 'notificacoes-users-card',

  components: {
    DataTable,
    TableFilters,
  },

  props: {
    listaIdUsuario: {
      type: Array,
      required: true,
    },
  },

  filters: {
    telefoneMask,
    dateFormatteBR,
  },

  data: () => ({
    headers,
    usuarios: [],
    valid: true,
    pagination: {
      page: 1,
      rowsPerPage: 5,
    },
    pagesSize: 1,
    filters: {
      tipoCadastro: '',
      tipoUsuario: '',
      categoria: '',
      segmento: '',
      estado: '',
      cidade: '',
      dataCadastroInicial: '',
      dataCadastroFinal: '',
      plano: '',
      termo: '',
    },
    selectAll: false,
  }),

  created() {
    this.filters = {
      ...this.filters,
      ...this.$route.query,
    };
    this.getUsuarios();
  },

  notifications: {
    showError: {
      title: 'Erro',
      message: 'Ocorreu um erro ao buscar os informações.',
      type: 'error',
    },
  },

  methods: {
    getUsuarios() {
      this.$loading.start();

      const { filters } = this;
      const {
        rowsPerPage: quantidadePorPagina,
        page: paginaAtual,
      } = this.pagination;

      const params = {
        quantidadePorPagina,
        paginaAtual,
        ...filters,
      }
      NotificacaoService
        .facade()
        .getUsers(params)
        .then(({ data }) => {
          this.usuarios = [];
          data.lista.map((usuario) => {
            const existsUsuario = this.listaIdUsuario.find(item => item === usuario.id_usuario);
            this.usuarios.push({
              ...usuario,
              enviarNotificacao: existsUsuario,
            });
          })
          const {
            pagina_atual: paginaAtual,
            pagina_total: paginaTotal,
          } = data;
          this.pagesSize = paginaTotal;
          this.pagination.page = paginaAtual <= paginaTotal ? paginaAtual : paginaTotal;
          this.$loading.finish();
        })
        .catch(() => {
          this.$loading.finish();
        })
    },
    setSearchTerm(event) {
      this.filters.termo = event
    },
    setCurrentPage(event) {
      this.pagination.page = event;
    },
    setRowsPerPage(event) {
      this.pagination.rowsPerPage = event;
    },
    setFilters(event) {
      this.filters = event;
    },
    updateCheckBox() {
      this.selectAll = !this.selectAll
    },
    toggleAll(selectAll) {
      if (selectAll) {
        this.usuarios.forEach((item) => {
          item.enviarNotificacao = true;
        });
      } else {
        this.usuarios.forEach((item) => {
          item.enviarNotificacao = false;
        });
      }
    }
  },
  watch: {
    filters: {
      handler() {
        const query = { ...this.filters };
        this
          .$router
          .push({ path: '/notificacoes', query })
        this.getUsuarios();
        this.$emit('set-filtro-payload', query)
      },
      deep: true,
    },
    'pagination.page': {
      handler() {
        this.getUsuarios();
      },
    },
    'pagination.rowsPerPage': {
      handler() {
        this.getUsuarios();
      },
    },
    usuarios: {
      handler(value) {
        this.$emit('set-users-payload', value);
      },
      deep: true,
    },
    selectAll: {
      handler(value) {
        this.toggleAll(value)
      },
    },
    listaIdUsuario: {
      handler(value) {
        value.map((idUsuario, index) => {
          let usuarioSelecionado = this
            .usuarios
            .find(({ id_usuario }) => id_usuario === idUsuario);
          if (usuarioSelecionado) {
            usuarioSelecionado.enviarNotificacao = true;
          }
        });
      },
      deep: true,
    },
  },
};
</script>
