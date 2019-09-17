<template lang="pug">
  #anunciantes
    .crud-title.pb-4 Anunciante
    data-table(
      no-data-text='Não há cadastros'
      :pagination.sync="pagination"
      :headers="headers"
      :items="anunciantes"
      :total-pages="pagesSize"
      :total-items="totalItems"
      @search="onSearchChange($event)"
      @clickitem="goToPreview($event)"
      disabled-actions
    )
      template(slot="search")
        table-filters(
          v-model="filters"
          @set-filter="setFilter($event)"
          :formaPagamento="formaPagamentos"
          :statusPagamento="statusPagamentos"
          :plano="planos"
          :tipoUsuario="tipoUsuarios"
          :tipoCadastro="tipoCadastros"
          :statusCadastro="statusCadastros"
          )
      template(
        slot="items"
        slot-scope="{ item }"
        )
        td.hand-mouse(@click="goToPreview(item)" :title="item.nome") {{ item.nome }}
        td.hand-mouse(@click="goToPreview(item)" :title="item.celular | telefoneMask") {{ item.celular | telefoneMask }}
        td.hand-mouse(@click="goToPreview(item)" :title="item.email") {{ item.email }}
        td.hand-mouse.text-xs-center(@click="goToPreview(item)" :title="mapTipoCadastro(item.tipo_cadastro)") {{ mapTipoCadastro(item.tipo_cadastro) }}
        td.hand-mouse(@click="goToPreview(item)" :title="mapTipoUsuario(item.tipo_usuario)") {{ mapTipoUsuario(item.tipo_usuario) }}
        td.hand-mouse(@click="goToPreview(item)" :title="mapStatusUser(item.status_cadastro)") {{ mapStatusUser(item.status_cadastro) }}
        td.hand-mouse.text-xs-center(@click="goToPreview(item)" :title="isExists(item.plano)") {{ isExists(item.plano) }}
        td.hand-mouse.text-xs-center(@click="goToPreview(item)" :title="item.status_pagamento") {{ item.status_pagamento }}
        td.hand-mouse.text-xs-center(@click="goToPreview(item)" :title="item.interatividade") {{ item.interatividade }}
        td.hand-mouse(@click="goToPreview(item)" :title="item.forma_pagamento") {{ item.forma_pagamento }}
        td
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
            v-tooltip(
              left
              v-if="!anuncianteAtivo(item)"
              )
              span Ativar
              v-btn.mx-0.mr-1(
                dark
                icon
                small
                outline
                color="grey"
                slot="activator"
                @click="ativarAnunciante(item)"
                :disabled="anuncianteEmAnalise(item)"
                )
                v-icon(small) check
            v-tooltip(
              left
              v-if="anuncianteAtivo(item)"
              )
              span Inativar
              v-btn.mx-0.mr-1(
                dark
                icon
                small
                outline
                color="success"
                slot="activator"
                @click="onInativarAnunciante(item)"
                :disabled="anuncianteEmAnalise(item)"
                )
                v-icon(small) check
</template>

<script>
import Vue from 'vue';
import DataTable from '@/components/DataTable.vue';
import UserService from '@/services/UserService';
import { telefoneMask } from '@/filters/masks';
import HeadersDataTable from './HeadersDataTable';
import TableFilters from './TableFilters.vue';
import PlanoService from '@/services/PlanosService';

export default {
  name: 'usuarios-data-table',

  components: {
    DataTable,
    TableFilters,
  },

  filters: {
    telefoneMask,
  },

  data: () => ({
    tipoUsuarios: [
      { value: 'Default', text: 'Todos' },
      { value: 'AnuncianteSmart', text: 'Anunciante Smart' },
      { value: 'AnuncianteSmartPremium', text: 'Anunciante Smart Premium' },
    ],
    tipoCadastros: [
      { value: 'Default', text: 'Todos' },
      { value: 'PessoaFisica', text: 'Pessoa Física' },
      { value: 'PessoaJuridica', text: 'Pessoa Jurídica' },
    ],
    statusCadastros: [
      { value: 'Default', text: 'Todos' },
      { value: 'EmAnalise', text: 'Em Análise' },
      { value: 'Aprovado', text: 'Aprovado' },
      { value: 'Reprovado', text: 'Reprovado' },
    ],
    statusPagamentos: [
      { value: 'Regular', text: 'Regular' },
      { value: 'Irregular', text: 'Irregular' },
    ],
    formaPagamentos: [
      { value: 'Cartao', text: 'Cartão de crédito' },
      { value: 'Boleto', text: 'Boleto' },
      { value: 'Free', text: 'Free' },
    ],
    filters: {
      tipoUsuario: 'Default',
      tipoCadastro: 'Default',
      statusCadastro: 'Default',
      idPlano: '',
      formaDePagamento: '',
      statusPagamento: '',
    },
    planos: [],
    mode: [],
    pagesSize: 1,
    pagination: {
      page: 1,
      rowsPerPage: 5,
    },
    anunciantes: [],
    headers: HeadersDataTable,
    searchValue: '',
    totalItems: 0,
  }),

  created() {
    this.getPlans();
    this.getAnunciantes();
  },

  notifications: {
    showError: {
      title: 'Erro',
      message: 'Ocorreu um erro ao obter os anunciantes.',
      type: 'error',
    },
    showSuccess: {
      title: 'Sucesso',
      message: 'Registro atualizado com sucesso.',
      type: 'success',
    },
  },

  methods: {
    setFilter(event) {
      this.filters = event;
    },
    isExists(plano) {

      if(plano) {
        return plano.titulo || '-';
      }
      return '-';
    },
    getPlans() {
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
    onInativarAnunciante(item) {
      const options = {
        title: 'Atenção',
        text: 'Deseja realmente inativar o usuário?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'SIM',
        cancelButtonText: 'NÃO',
      };

      this
        .$swal(options)
        .then(result => result.value && this.inativarAnunciante(item));
    },
    mapTipoUsuario(typeAnunciante) {
      const mapTipos = {
        AnuncianteSmart: 'Anunciante Smart',
        AnuncianteSmartPremium: 'Anunciante Smart Premium',
      };

      return mapTipos[typeAnunciante];
    },
    mapTipoCadastro(typeCadastro) {
      const mapTipos = {
        PessoaFisica: 'PF',
        PessoaJuridica: 'PJ',
      };

      return mapTipos[typeCadastro];
    },
    mapGetResponse(list) {
      return list.map(item => ({
        ...item,
        switchStatus: item.status === 1,
      }));
    },
    getAnunciantes() {
      this.$loading.start();

      const {
        page,
        rowsPerPage,
      } = this.pagination;

      const { filters } = this;

      const optionsRequest = {
        pagina_atual: page,
        quantidade_por_pagina: rowsPerPage,
        ordenar: this.pagination.sortBy,
        descending: this.pagination.descending,
        termo: this.searchValue,
        ...filters,
      };

      UserService
        .facade()
        .findAnunciantes(optionsRequest)
        .then(({ data }) => {
          this.anunciantes = data.lista || [];
          this.totalItems = data.lista.length || 0;
          this.pagesSize = data.pagina_total;
          this.$loading.finish();
        })
        .catch(() => {
          this.showError();
        });
    },
    onSearchChange(searchValue) {
      this.searchValue = searchValue;
      this.getAnunciantes();
    },
    mapStatusUser(value) {
      const mapTypes = {
        Default: '',
        EmAnalise: 'Em análise',
        Aprovado: 'Aprovado',
        Reprovado: 'Reprovado',
      };

      return mapTypes[value];
    },
    goToPreview(item) {
      this
        .$router
        .push(`/anunciantes/${item.id_usuario}/detalhes`);
    },
    goToEdit(item) {
      this
        .$router
        .push(`/anunciantes/${item.id_usuario}`);
    },
    anuncianteAtivo(item) {
      return item.usuario_ativo;
    },
    anuncianteEmAnalise(item) {
      return item.status_cadastro === 'EmAnalise'
    },
    ativarAnunciante(item) {
      UserService
        .facade()
        .enable(item.id_usuario)
        .then(() => {
          this.showSuccess({
            message: 'Anunciante ativado com sucesso!',
          });
          this.updateUsuario(item.id_usuario);
        })
        .catch(({ data }) => {
          this.showError({
            message: data.message,
          });
        });
    },
    inativarAnunciante(item) {
      UserService
        .facade()
        .disable(item.id_usuario)
        .then(() => {
          this.showSuccess({
            message: 'Anunciante desativado com sucesso!',
          });
          this.updateUsuario(item.id_usuario);
        })
        .catch(({ data }) => {
          this.showError({
            message: data.message,
          });
        });
    },
    updateUsuario(id) {
      UserService
        .facade()
        .find(id)
        .then(({ data }) => {
          this.anunciantes.forEach((item, index) => {
            if (item.id_usuario === id) {
              Vue.set(this.anunciantes, index, data);
            }
          });
        });
    },
  },

  watch: {
    filters: {
      handler() {
        this.getAnunciantes();
      },
      deep: true,
    },
    pagination: {
      handler() {
        this.getAnunciantes();
      },
      deep: true,
    }
  },
};
</script>

<style lang="stylus">
.hand-mouse
  cursor: pointer
</style>
