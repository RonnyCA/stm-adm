<template lang="pug">
  #clientes
    .crud-title.pb-4 Cliente
    data-table(
      no-data-text='Não há cadastros'
      :pagination.sync="pagination"
      :headers="headers"
      :items="clientes"
      :total-pages="pagesSize"
      :total-items="totalItems"
      @search="onSearchChange($event)"
      @clickitem="goToPreview($event)"
      disabled-actions
    )
      template(slot="search")
        table-filters(
          v-model="filters"
          @set-filter-user="setFilterTypeUser($event)"
          @set-filter-status="setFilterStatus($event)"
          @set-filter-type-payment="setFilterTypePayment($event)"
          @set-filter-status-payment="setFilterStatusPayment($event)"
          :tipoUsuario="tipoUsuarios"
          :status="status"
          :formaPagamento="formaPagamentos"
          :statusPagamento="statusPagamentos"
          )
      template(
        slot="items"
        slot-scope="{ item }"
        )
        td.hand-mouse(@click="goToPreview(item.id_usuario)" :title="item.nome") {{ item.nome }}
        td.hand-mouse(@click="goToPreview(item.id_usuario)" :title="item.documento | cpfOrCnpjMask") {{ item.documento | cpfOrCnpjMask }}
        td.hand-mouse(@click="goToPreview(item.id_usuario)" :title="item.celular | telefoneMask") {{ item.celular | telefoneMask }}
        td.hand-mouse(@click="goToPreview(item.id_usuario)" :title="item.email") {{ item.email }}
        td.hand-mouse(@click="goToPreview(item.id_usuario)" :title="mapTipoUsuario(item.tipo_usuario)") {{ mapTipoUsuario(item.tipo_usuario) }}
        td.hand-mouse.text-xs-center(@click="goToPreview(item.id_usuario)" :title="item.interatividade") {{ item.interatividade }}
        td.hand-mouse(@click="goToPreview(item.id_usuario)" :title="item.forma_pagamento") {{ item.forma_pagamento }}
        td.hand-mouse.text-xs-center(@click="goToPreview(item.id_usuario)" :title="item.status_pagamento") {{ item.status_pagamento }}
        td
          v-layout(row wrap)
            v-tooltip(
              left
              v-if="!clienteAtivo(item)"
              )
              span Ativar
              v-btn.mx-0.mr-1(
                dark
                icon
                small
                outline
                color="grey"
                slot="activator"
                @click="ativarCliente(item)"
                )
                v-icon(small) check
            v-tooltip(
              left
              v-if="clienteAtivo(item)"
              )
              span Inativar
              v-btn.mx-0.mr-1(
                dark
                icon
                small
                outline
                color="success"
                slot="activator"
                @click="onInativarCliente(item.id_usuario)"
                )
                v-icon(small) check
</template>

<script>
import DataTable from '@/components/DataTable.vue';
import UserService from '@/services/UserService';
import TableFilters from './TableFilters.vue';
import HeadersDataTable from './HeadersDataTable';
import { cpfOrCnpjMask, telefoneMask } from '@/filters/masks';

export default {
  name: 'usuarios-data-table',

  components: {
    DataTable,
    TableFilters,
  },

  filters: {
    telefoneMask,
    cpfOrCnpjMask,
  },

  data: () => ({
    tipoUsuarios: [
      { value: 'Default', text: 'Todos' },
      { value: 'ClienteSmart', text: 'Cliente Smart' },
      { value: 'ClienteSmartPremium', text: 'Cliente Smart Premium' },
    ],
    status: [
      { value: true, text: 'Ativo' },
      { value: false, text: 'Inativo' },
    ],
    statusPagamentos: [
      { value: 'Regular', text: 'Regular' },
      { value: 'Irregular', text: 'Irregular' },
    ],
    formaPagamentos: [
      { value: 'Cartao', text: 'Cartão de crédito' },
      { value: 'Boleto', text: 'Boleto bancário' },
      { value: 'Free', text: 'Free' },

    ],
    filters: {
      tipoUsuario: '',
      status: '',
      statusPagamento: '',
      formaPagamento: '',
    },
    mode: [],
    pagesSize: 1,
    pagination: {
      page: 1,
      rowsPerPage: 5,
    },
    clientes: [],
    headers: HeadersDataTable,
    searchValue: '',
    totalItems: 0,
  }),

  created() {
    this.getClientes();
  },

  notifications: {
    showSuccess: {
      title: 'Sucesso',
      message: 'Cliente salva com sucesso!',
      type: 'success',
    },
    showError: {
      title: 'Erro',
      message: 'Ocorreu um erro ao gravar.',
      type: 'error',
    },
  },

  methods: {
    setFilterTypeUser(event) {
      this.filters.tipoUsuario = event;
    },
    setFilterStatus(event) {
      this.filters.status = event;
    },
    setFilterTypePayment(event) {
      this.filters.formaPagamento = event;
    },
    setFilterStatusPayment(event) {
      this.filters.statusPagamento = event;
    },
    getClientes() {
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
        .findClientes(optionsRequest)
        .then(({ data }) => {
          this.clientes = data.lista || [];
          this.totalItems = data.lista.length || 0;
          this.pagesSize = data.pagina_total;
          this.$loading.finish();
        })
        .catch(() => {
          this.showError();
          this.$loading.finish();
        });
    },

    mapTipoUsuario(typeCliente) {
      const mapTipos = {
        ClienteSmart: 'Cliente Smart',
        ClienteSmartPremium: 'Cliente Smart Premium',
      };

      return mapTipos[typeCliente];
    },

    goToPreview(id) {
      this
        .$router
        .push(`/clientes/${id}/detalhes`);
    },

    clienteAtivo(item) {
      return item.usuario_ativo;
    },

    onSearchChange(searchValue) {
      this.searchValue = searchValue;
      this.getClientes();
    },

    ativarCliente(item) {
      this.$loading.start();
      UserService
        .facade()
        .enable(item.id_usuario)
        .then(() => {
          this.showSuccess({
            message: 'Cliente ativado com sucesso!',
          });
          this.getClientes(item.id_usuario);
          this.$loading.finish();
        })
        .catch(({ data }) => {
          this.showError({
            message: data.message,
          });
          this.$loading.finish();
        });
    },

    inativarCliente(id) {
      this.$loading.start();

      UserService
        .facade()
        .disable(id)
        .then(() => {
          this.showSuccess({
            message: 'Cliente desativado com sucesso!',
          });
          this.getClientes(id);
          this.$loading.finish();
        })
        .catch(({ data }) => {
          this.showError({
            message: data.message,
          });
          this.$loading.finish();
        });
    },

    onInativarCliente(id) {
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
        .then(result => result.value && this.inativarCliente(id));
    },
  },

  watch: {
    filters: {
      deep: true,
      handler() {
        this.getClientes();
      },
    },
    pagination: {
      handler() {
        this.getClientes();
      },
      deep: true,
    }
  },
};
</script>
