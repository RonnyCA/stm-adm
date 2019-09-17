<template lang="pug">
  #notificacoesFormView
    .crud-title.pb-4 Nova Notificação
    v-form(
      ref="form"
      v-model="valid"
      lazy-validation
      )
      v-card.pb-2
        v-card-text
          v-container.pa-0(grid-list-md)
            v-layout(row wrap align-center).px-2
              v-flex(xs12)
                v-text-field(
                  label="Título"
                  v-model="payload.titulo"
                  :rules="rules"
                  required
                  )
              v-flex(xs12)
                v-textarea(
                  label="Mensagem"
                  v-model="payload.descricao"
                  :rules="rules"
                  required
                  )
        v-card-actions.px-4
          v-spacer
          v-btn.primary(
            @click="enviarNotificacao()"
            ) Concluir
    users-card(
      :listaIdUsuario="payload.listaIdUsuario"
      @set-users-payload="setUsersPayload($event)"
      @set-filtro-payload="setFiltroPayload($event)"
      )
</template>

<script>
import UsersCard from './UsersCard';
import NotificacaoService from '@/services/NotificacaoService';

export default {
  name: 'notificacoes-form-view',

  components: {
    UsersCard,
  },

  data: () => ({
    valid: true,
    payload: {
      titulo: '',
      descricao: '',
      filtro: {},
      listaIdUsuario: [],
    },
    concluir: false,
    rules: [
      v => !!v || 'Campo obrigatório',
    ],
  }),

  computed: {
    disabledConcluir() {
      const { payload } = this;
      return payload.filtro === {} && payload.listaIdUsuario.length === 0;
    },
  },

  notifications: {
    showSuccess: {
      title: 'Sucesso',
      message: 'Sucesso ao enviar as notificações.',
      type: 'success',
    },
    showError: {
      title: 'Erro',
      message: 'Ocorreu um erro ao enviar as notificações.',
      type: 'error',
    },
  },

  methods: {
    setUsersPayload(event) {
      const usuariosSelecionados = event.filter(usuario => usuario.enviarNotificacao === true);
      const usuariosNaoSelecionados = event.filter(usuario => usuario.enviarNotificacao === false);
      usuariosSelecionados.map(({ id_usuario }) => {
        const existsUsuario = this.payload.listaIdUsuario.find(item => item === id_usuario);
        if (!existsUsuario) {
          this.payload.listaIdUsuario.push(id_usuario);
        }
      });
      usuariosNaoSelecionados.map(({ id_usuario }) => {
        const index = this.payload.listaIdUsuario.findIndex(item => item === id_usuario);
        if (index > -1) {
          this.removerItemListaUsuarios(index);
        }
      })
    },
    setFiltroPayload(event) {
      this.payload.filtro = event;
    },
    removerItemListaUsuarios(event) {
      this.payload.listaIdUsuario.splice(event, 1);
    },
    enviarNotificacao() {
      if (!this.formIsValid()) {
        return false;
      }
      if (this.disabledConcluir) {
        return this.showError({ message: 'Não foi possível concluir pois nenhum usuário ou filtro foi selecionados' });
      }
      this.$loading.start();

      if (!this.payload.filtro.tipoCadastro) {
        this.payload.filtro.tipoCadastro = 'Default';
      }

      if (!this.payload.filtro.tipoUsuario) {
        this.payload.filtro.tipoUsuario = 'Default';
      }

      NotificacaoService
        .facade()
        .enviarNotificacao(this.payload)
        .then(() => {
          this.$loading.finish();
          this.showSuccess({ message: 'Notificações enviadas com sucesso!' });
        })
        .catch(() => {
          this.$loading.finish();
          this.showError({ message: 'Ocorreu um erro ao tentar enviar as notificações!' });
        });
    },
    formIsValid() {
      return this
      .$refs
      .form
      .validate();
    },
  },
};
</script>
