<template lang="pug">
  #categorias
    .crud-title.pb-4 Planos
    data-table(
      :pagination.sync="pagination"
      :headers="headers"
      :items="categorias"
      :totalPages="pagesSize"
      @newitem="goToCadastrar()"
      @changePage="getPlans()",
      @changeRowsPerPage="getPlans()"
      @edititem="goToEdit($event)"
      @search="onSearchChange($event)"
      @deleteitem="onDeleteCategoria($event)"
    )
      template(
        slot="items"
        slot-scope="{ item }"
        )
        td {{ item.titulo }}
        td {{ item.porcentagem_minima }}
        td {{ item.porcentagem_maxima }}
        td {{ item.numero_publicacoes }}
</template>

<script>
import DataTable from '@/components/DataTable.vue';
import PlanosService from '@/services/PlanosService';
import HeadersDataTable from './HeadersDataTable';

export default {
  name: 'planos-data-table',

  components: {
    DataTable,
  },

  data: () => ({
    pagesSize: 1,
    pagination: {
      page: 1,
      rowsPerPage: 5,
    },
    categorias: [],
    headers: HeadersDataTable,
    searchValue: '',
  }),

  notifications: {
    showDeleteSuccessMessage: {
      type: 'success',
      title: 'Sucesso!',
      message: 'Categoria removida com sucesso!',
    },
    showDeleteErrorMessage: {
      type: 'error',
      title: 'Erro!',
      message: 'Falha ao remover registro!',
    },
  },

  created() {
    this.getPlans();
  },

  methods: {
    getPlans() {
      this.$loading.start();

      const {
        page,
        rowsPerPage,
      } = this.pagination;

      const optionsRequest = {
        pagina_atual: page,
        quantidade_por_pagina: rowsPerPage,
        termo: this.searchValue,
      };

      PlanosService
        .facade()
        .findAll(optionsRequest)
        .then(({ data }) => {
          this.categorias = data.lista || [];
          this.pagesSize = data.pagina_total;
          this.$loading.finish();
        })
        .catch(() => this.$loading.finish());
    },
    goToCadastrar() {
      this
        .$router
        .push('/planos/cadastrar');
    },
    goToEdit({ id }) {
      this
        .$router
        .push(`/planos/${id}`);
    },
    onSearchChange(searchValue) {
      this.searchValue = searchValue;
      this.getPlans();
    },
    onDeleteCategoria({ id }) {
      const options = {
        title: 'Atenção',
        text: 'Deseja realmente excluir a categoria?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'SIM',
        cancelButtonText: 'NÃO',
      };

      this
        .$swal(options)
        .then(result => result.value && this.deleteCategoria(id))
        .catch(() => {});
    },
    deleteCategoria(id) {
      this.$loading.start();

      PlanosService
        .facade()
        .delete(id)
        .then(() => {
          this.$loading.finish();
          this.getPlans();
          this.showDeleteSuccessMessage();
        })
        .catch(({ data }) => {
          this.showDeleteErrorMessage({ message: data.message });
          this.$loading.finish();
        });
    },
  },
};
</script>
