<template lang="pug">
  #categorias
    .crud-title.pb-4 Categorias
    data-table(
      :pagination.sync="pagination"
      :headers="headers"
      :items="categorias"
      :totalPages="pagesSize"
      no-data-text="Não foram encontrados resultados para a busca"
      @newitem="goToCadastrar()"
      @changePage="getCategorias()",
      @changeRowsPerPage="getCategorias()"
      @edititem="goToEdit($event)"
      @search="onSearchChange($event)"
      @deleteitem="onDeleteCategoria($event)"
    )
      template(
        slot="items"
        slot-scope="{ item }"
        )
        td {{ item.titulo }}
        v-layout.mt-3
          span.center-text {{ item.segmentos.length }}
</template>

<script>
import DataTable from '@/components/DataTable.vue';
import CategoriaService from '@/services/CategoriaService';
import HeadersDataTable from './HeadersDataTable';

export default {
  name: 'categorias-data-table',

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
    this.getCategorias();
  },

  methods: {
    getCategorias() {
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

      CategoriaService
        .facade()
        .findAll(optionsRequest)
        .then(({ data }) => {
          let categorias = [];
          data.lista.map((categoria) => {
            categorias.push({
              ...categoria,
              qtd_segmentos: categoria.segmentos.length,
            });
          });
          this.categorias = categorias;
          this.pagesSize = data.pagina_total;
          this.$loading.finish();
        });
    },
    goToCadastrar() {
      this
        .$router
        .push('/categorias/cadastrar');
    },
    goToEdit({ id }) {
      this
        .$router
        .push(`/categorias/${id}`);
    },
    onSearchChange(searchValue) {
      this.searchValue = searchValue;
      this.getCategorias();
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
        .then((result) => {
          if (!result.value) {
            return false;
          }

          return this.deleteCategoria(id);
        });
    },
    deleteCategoria(id) {
      this.$loading.start();

      CategoriaService
        .facade()
        .delete(id)
        .then(() => {
          this.$loading.finish();
          this.getCategorias();
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

<style lang="stylus">
  .center-text
    top 100px !important
    margin-left 90px
</style>

