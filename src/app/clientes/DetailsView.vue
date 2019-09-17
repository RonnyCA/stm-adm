<template lang="pug">
  #cliente-details
    .crud-title.pb-4 Detalhes
    v-card
      v-form
        v-container
          v-layout(row wrap)
            v-flex(xs12)
              v-text-field(
                label="Nome completo"
                v-model="cliente.nome"
                readonly
                )
          v-layout(row wrap)
            v-flex(xs12)
              v-text-field(
                label="Email"
                v-model="cliente.email"
                readonly
                )

          v-layout(row wrap)
            v-flex(md2 xs12)
              v-text-field(
                label="CPF"
                v-model="cliente.documento"
                :mask="documentoMask"
                readonly
                )
            v-flex(md2 xs12)
              v-text-field(
                label="Telefone Residencial"
                v-model="cliente.telefone_comercial"
                :mask="maskPhone(cliente.telefone_comercial)"
                readonly
                )
            v-flex(md2 xs12)
              v-text-field(
                label="Celular"
                v-model="cliente.celular"
                :mask="maskPhone(cliente.celular)"
                readonly
                )
            v-flex(md5 xs12)
              v-text-field(
                label="Logradouro"
                v-model="endereco.logradouro"
                readonly
                )
            v-flex(md1 xs12)
              v-text-field(
                label="Número"
                v-model="endereco.numero"
                readonly
                )
          v-layout(row wrap)
            v-flex(md3 xs12)
              v-text-field(
                label="Bairro"
                v-model="endereco.bairro"
                readonly
                )
            v-flex(md3 xs12)
              v-text-field(
                label="Cidade"
                v-model="endereco.cidade"
                readonly
                )
            v-flex(md2 xs12)
              v-text-field(
                label="Estado"
                v-model="endereco.estado"
                readonly
                )
            v-flex(md1 xs12)
              v-text-field(
                label="CEP"
                v-model="endereco.cep"
                mask="#####-###"
                readonly
                )
            v-flex(md3 xs12)
              v-text-field(
                label="Complemento"
                v-model="endereco.complemento"
                readonly
                )
          v-layout(row wrap)
            v-flex(md6 xs12)
              v-text-field(
                label="Instagram"
                v-model="cliente.instagram"
                append-icon="launch"
                @click:append="openNewTab(cliente.instagram)"
                readonly
                )
            v-flex(md6 xs12)
              v-text-field(
                label="Facebook"
                v-model="cliente.facebook"
                append-icon="launch"
                @click:append="openNewTab(cliente.facebook)"
                readonly
                )
            v-flex(md6 xs12)
              v-text-field(
                label="Status do pagamento"
                v-model="cliente.status_pagamento"
                readonly
                )
            v-flex(md6 xs12)
              v-text-field(
                label="Status do cliente"
                v-model="cliente.usuario_ativo"
                readonly
                )
    foto-perfil-card(v-model="cliente.arquivo")
    fotos-card(v-model="cliente.fotos")
    secao-smart(v-model="cliente")
    secao-interacao(v-model="cliente")
</template>

<script>
import UserService from '@/services/UserService';
import FotosCard from '@/components/FotosCard.vue';
import FotoPerfilCard from '@/components/FotoPerfilCard.vue';
import { telefoneMask, cpfOrCnpjMask } from '@/filters/masks';
import SecaoSmart from './SecaoSmart.vue';
import SecaoInteracao from './SecaoInteracao.vue';

export default {
  name: 'cliente-details-view',

  components: {
    FotosCard,
    SecaoSmart,
    SecaoInteracao,
    FotoPerfilCard,
  },

  props: {
    statusCliente: {
      type: Boolean,
    },
  },

  filters: {
    cpfOrCnpjMask,
    telefoneMask,
  },

  data: () => ({
    statusClientes: [
      { value: true, text: 'Ativo' },
      { value: false, text: 'Inativo' },
    ],
    clienteAtivo: 'Ativo',
    clienteInativo: 'Inativo',
    cliente: {
      documento: '',
      celular: '',
      telefone_comercial: '',
    },
  }),

  computed: {
    endereco() {
      return this
        .cliente
        .endereco || {};
    },
    documentoMask() {
      const { documento } = this.cliente;
      if (documento.length > 11) {
        return '##.###.###/####-##';
      }
      return '###.###.###-###';
    },
  },

  created() {
    const { clienteId } = this.$route.params;

    if (clienteId) {
      this.loadData(clienteId);
    }
  },

  notifications: {
    showError: {
      title: 'Erro',
      message: 'Ocorreu um erro ao carregar.',
      type: 'error',
    },
  },

  methods: {
    verifyIsActive(status) {
      if (status === true) {
        return this.cliente.usuario_ativo = this.clienteAtivo;
      }
      else {
        return this.cliente.usuario_ativo = this.clienteInativo;
      }
    },
    maskPhone(phone) {
      if (!phone) {
        return '';
      }
      if (phone.length <= 10) {
        return '(##) ####-#####';
      }
      return '(##) # ####-####';
    },
    loadData(id) {
      this.$loading.start();

      UserService
        .facade()
        .find(id)
        .then(({ data }) => {
          this.cliente = data;
          this.verifyIsActive(this.cliente.usuario_ativo);
          this.$loading.finish();
        })
        .catch(() => {
          this.showError({
            message: 'Ocorreu um erro ao obter os dados do cliente.',
          });
          this.$loading.finish();
        });
    },
    openNewTab(url) {
      window.open(url, '_blank');
    },
  },
};
</script>
