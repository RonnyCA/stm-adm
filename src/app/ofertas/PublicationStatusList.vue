<template lang="pug">
  #status-publicacao-list
    data-table.elevation-0(
      disabled-actions
      :items="ofertas"
      :headers="headers"
      :total-pages="pagesSize"
      @changePage="getOfertas()"
      no-data-text='Não há cadastros'
      :pagination.sync="pagination"
      @changeRowsPerPage="getOfertas()"
      @search="onSearchChange($event)"
      @clickitem="goToPreview($event)"
      )
      template(
        slot="items"
        slot-scope="{ item }"
        )
        td.hand-mouse(@click="goToPreview(item)") {{ item.nome_anunciante }}
        td.hand-mouse(@click="goToPreview(item)") {{ item.titulo }}
        td.hand-mouse(@click="goToPreview(item)") {{ item.valor_sem_desconto | monetaryBrlFilter }}
        td.hand-mouse(@click="goToPreview(item)") {{ item.desconto | percentValue }}
        td.hand-mouse( @click="goToPreview(item)") {{ item.valor_em_smarts | monetarySmartsFilter }}
        td(v-if="params.edit")
          v-layout(row wrap)
            v-tooltip(left)
              span Editar
              v-btn.mx-0.mr-1(
                dark
                icon
                small
                outline
                color="warning"
                slot="activator"
                @click="goToEdit(item)"
                )
                v-icon(small) edit
</template>

<script>
import DataTable from '@/components/DataTable.vue';
import OfertasService from '@/services/OfertasService';
import HeadersDataTable from './HeadersDataTable';
import HeadersDataTableWithoutAction from './HeadersDataTableWithoutAction';
import {monetaryBrlFilter, monetarySmartsFilter, percentValue} from '@/filters/monetary'

export default {
  name: 'status-publicacao-list',

  components: {
    DataTable,
  },

  props: {
    params: {
      type: Object,
      required: true,
    },
  },

  data: vm => ({
    headers: vm.params.edit ? HeadersDataTable : HeadersDataTableWithoutAction,
    desserts: [],
    mode: [],
    pagesSize: 10,
    pagination: {
      page: 1,
      rowsPerPage: 10,
    },
    ofertas: [],
    teste:[],
    avaliacaoOferttas: [],
    searchValue: '',

  }),

  mounted() {
    this.getOfertas();
  },

  notifications: {
    showError: {
      title: 'Erro',
      message: 'Ocorreu um erro ao obter as ofertas.',
      type: 'error',
    },
    showSuccess: {
      title: 'Sucesso',
      message: 'Registro atualizado com sucesso.',
      type: 'success',
    },
  },

  computed: {
    isDiferentWaiting() {
      return this.ofertas.avaliacao.status !== 'Aguardando';
    },
  },
  methods: {
    getOfertas() {
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
        ...this.params,
      };

      OfertasService
        .facade()
        .getOffers(optionsRequest)
        .then(({ data }) => {
          this.ofertas = data.lista;
          this.teste = data.lista;
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
      this.getOfertas();
      this.prepareData();
    },
    goToPreview(item) {
      this
        .$router
        .push(`/ofertas/${item.id}/detalhes`);
    },
    goToEdit(item) {
      this
        .$router
        .push(`/ofertas/${item.id}`);
    },
    prepareData(){
      this.teste.name = 'teste'
    },
  },
  filters: {
    monetaryBrlFilter,
    monetarySmartsFilter,
    percentValue
  },
};
</script>
