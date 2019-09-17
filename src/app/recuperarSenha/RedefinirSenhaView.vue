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
      h1.titulo.mb-4 Redefinir senha
      v-card.elevation-0(
        color="transparent"
        )
        v-layout(justify-center align-center)
          v-flex.text-xs-center
            v-text-field(
              label="Insira o token"
              v-model="payload.token"
              )
        v-form(
          v-if="lengthToken"
          v-model="valid"
          ref="form"
          )
          v-layout(justify-center align-center)
            v-flex.text-xs-center
              v-text-field(
                label="Nova senha"
                v-model="payload.senha"
                type="password"
                :rules="[rules.required, rules.samePassword]"
               )
              v-text-field(
                label="Confirmar senha"
                v-model="payload.confirmacaoSenha"
                type="password"
                :rules="[rules.required, rules.samePassword]"
                )
          v-card-actions.px-3
            v-btn(
              flat
              color="primary"
              to="/"
              ) Voltar
            v-spacer
            v-btn(
              :loading="$loading.isLoading"
              :disabled="$loading.isLoading"
              color="primary"
              @click="send"
              ) Redefinir
</template>

<script>
import RecoverPasswordService from '@/services/RecoverPasswordService';

export default {
  name: 'redefinir-senha',

  data: vm => ({
    lengthToken: false,
    valid: true,
    payload: {
      token: null,
      senha: '',
      confirmacaoSenha: '',
    },
    rules: {
      required: v => !!v || 'Campo obrigatório',
      samePassword: v => vm.samePassword(vm.payload.senha, v) || 'As senhas não conferem.',
    },
  }),

  methods: {
    checkLengthToken(token) {
      if (token.length === 4) {
        this.checkTokenIsValid(token);
      }
    },
    checkTokenIsValid(token) {
      this.$loading.start();

      const params = { token };

      RecoverPasswordService
        .facade()
        .verificaTokenValido(params)
        .then(() => {
          this.lengthToken = true;
          this.$loading.finish();
        })
        .catch(({ data }) => {
          this.showSwalErro(data.message);
          this.$loading.finish();
        });
    },
    send() {
      if (!this.isFormularioValido()) {
        return;
      }

      this.$loading.start();
      RecoverPasswordService
        .facade()
        .alterarSenha(this.payload)
        .then(() => {
          this.$loading.finish();
          this.showSwalSuccess();
          this.$router.push('/login');
        }).catch(({ data }) => {
          this.$loading.finish();
          this.showSwalErro(data.message);
        });
    },

    samePassword(password, confirmation) {
      return password
        && confirmation
        && password === confirmation;
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
        text: 'Senha alterada com sucesso.',
      });
    },

    showSwalErro(message) {
      this.$swal({
        type: 'error',
        title: 'Oops...',
        text: message,
      });
    },
  },
  watch: {
    'payload.token': {
      handler(value) {
        this.checkLengthToken(value);
      },
    },
  },
};
</script>
