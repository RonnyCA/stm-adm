<template lang="pug">
  v-layout(
    justify-center
    align-center
    )
    v-flex.text-xs-center(
      lg3
      md5
      sm6
      xs12
      )
      img.mb-5(
        src="@/assets/logo-roxa.png"
        width="150em"
        )
      .title Esqueceu sua senha?
      .subtitle.mb-4 Informe seu email de cadastro abaixo
      v-card.elevation-0(
        color="transparent"
        )
        v-form(
          v-model="valid"
          ref="form"
          )
          v-card-text
            v-text-field(
              label="Email"
              v-model="email"
              :rules="emailRules"
              )
          v-card-actions.px-3
            v-btn(
              flat
              color="primary"
              to="/"
              ) Voltar
            v-spacer
            v-btn(
              color="primary"
              :loading="$loading.isLoading"
              :disabled="$loading.isLoading"
              @click="send"
              ) Enviar
</template>

<script>
import RecoverPasswordService from '@/services/RecoverPasswordService';

export default {
  name: 'recuperar-senha',

  data: () => ({
    email: '',
    valid: true,
    emailRules: [
      v => !!v || 'Email é obrigatório',
    ],
  }),

  methods: {
    send() {
      if (!this.isFormularioValido()) {
        return;
      }

      this.$loading.start();
      const params = { email: this.email };
      RecoverPasswordService
        .facade()
        .recuperarSenha(params)
        .then(() => {
          this.showSwalSuccess();
          this.goToRefactor();
          this.$loading.finish();
        })
        .catch(({ data }) => {
          const clientError = (data.status >= 400 && data.status < 500);
          const message = clientError ? data.message : 'Ocorreu um erro interno, tente novamente mais tarde.';
          this.showSwalError(message);
          this.$loading.finish();
        });
    },
    goToRefactor() {
      this
        .$router
        .push('/redefinir-senha');
    },
    isFormularioValido() {
      return this
        .$refs
        .form
        .validate();
    },
    showSwalSuccess() {
      this.$swal({
        type: 'success',
        title: 'Sucesso!',
        text: 'Enviamos um link de recuperação de senha para o email informado',
      });
    },
    showSwalError(message) {
      this.$swal({
        type: 'error',
        title: 'Oops...',
        text: message,
      });
    },
  },
};
</script>
