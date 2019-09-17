<template lang="pug">
  #administradores
    .crud-title.pb-4 Administradores
    data-table(
      :pagination.sync="pagination"
      :headers="headers"
      :items="administradores"
      :totalPages="pagesSize"
      :disableRowsPerPage="true"
      :rowsPerPagePossibilites="[15]"
      @newitem="goToCadastrar()"
      @changePage="getAdministradores()",
      @changeRowsPerPage="getAdministradores()"
      @edititem="goToEdit($event)"
      @search="onSearchChange($event)"
      @deleteitem="onDeleteAdministrador($event)"
    )
      template(
        slot="items"
        slot-scope="{ item }"
        )
        td {{ item.nome_completo }}
        td {{ item.usuario.email }}
</template>

<script>
import DataTable from '@/components/DataTable.vue';
import AdministratorService from '@/services/AdministratorService';
import HeadersDataTable from './HeadersDataTable';

export default {
  name: 'administradores-data-table',

  components: {
    DataTable,
  },

  data: () => ({
    pagesSize: 1,
    pagination: {
      page: 1,
      rowsPerPage: 15,
    },
    administradores: [],
    headers: HeadersDataTable,
    searchValue: '',
  }),

  notifications: {
    showDeleteSuccessMessage: {
      type: 'success',
      title: 'Sucesso!',
      message: 'Administrador removido com sucesso!',
    },
    showDeleteErrorMessage: {
      type: 'error',
      title: 'Erro!',
      message: 'Falha ao remover registro!',
    },
    showError: {
      type: 'error',
      title: 'Erro!',
      message: 'Ocorreu um erro ao obter os administradores.',
    }
  },

  created() {
    this.getAdministradores();
  },

  methods: {
    getAdministradores() {
      this.$loading.start();

      const {
        page,
        rowsPerPage,
      } = this.pagination;

      const { filters } = this;

      const optionsRequest = {
        pagina_atual: page,
        quantidade_por_pagina: rowsPerPage,
        termo: this.searchValue,
        ...filters,
      };

      AdministratorService
        .facade()
        .findAll(optionsRequest)
        .then(({ data }) => {
          this.administradores = data.lista || [];
          this.pagesSize = data.pagina_total;
          this.$loading.finish();
        })
        .catch(() => {
          this.showError();
          this.$loading.finish();
        });
    },
    onSearchChange(searchValue) {
      this.searchValue = searchValue;
      this.getAdministradores();
    },
    goToCadastrar() {
      this
        .$router
        .push('/administradores/cadastrar');
    },
    goToEdit({ usuario }) {
      this
        .$router
        .push(`/administradores/${usuario.id}`);
    },
    onDeleteAdministrador({ id }) {
      const options = {
        title: 'Atenção',
        text: 'Deseja realmente excluir o administrador?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'SIM',
        cancelButtonText: 'NÃO',
      };

      this
        .$swal(options)
        .then((result) => {
          if (!result.value) {
            return false;
          }

          return this.deleteAdministrador(id);
        });
    },
    deleteAdministrador(id) {
      this.$loading.start();

      AdministratorService
        .facade()
        .delete(id)
        .then(() => {
          this.$loading.finish();
          this.getAdministradores();
          this.showDeleteSuccessMessage();
        })
        .catch(({ data }) => {
          this.showDeleteErrorMessage({ message: data });
          this.$loading.finish();
        });
    },
  },
};
</script>
