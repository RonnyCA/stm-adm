<template lang="pug">
  v-container.pa-0(
    fluid
    fill-height
    )
    v-layout(
      align-center
      justify-center
      )
      v-flex.text-xs-center(
        lg3
        md5
        sm6
        xs12
        )
        img.pb-5(
          src="@/assets/logo-roxa.png"
          width="150em"
        )
        v-card.elevation-0(color="transparent")
          v-form(
            ref="form"
            @submit="doLogin()"
            )
            v-card-text
              v-text-field(
                label="Login"
                v-model="login"
                :rules="[rules.required]"
                )
              v-text-field(
                label="Senha"
                type="password"
                v-model="password"
                :rules="[rules.required]"
                )
            v-card-actions.px-3
              v-btn(
                flat
                color="primary"
                to="recuperar-senha"
                ) Esqueci minha senha
              v-spacer
              v-btn(
                type="submit"
                color="primary"
                :loading="doingLogin"
                :disabled="verifyButton || doingLogin"
                ) Acessar
</template>

<script>
import LoginService from '@/services/LoginService';
import { throwStatement } from 'babel-types';

export default {
  name: 'login',

  data: () => ({
    login: '',
    password: '',
    doingLogin: false,
    rules: {
      required: v => !!v || 'Campo obrigatório',
    },
  }),

  computed: {
    verifyButton() {
      return this.login === '' || this.password === '';
    },
  },

  methods: {
    goToHome() {
      return this
        .$router
        .replace('/');
    },
    formIsValid() {
      return this
        .$refs
        .form
        .validate();
    },
    doLogin() {
      if (!this.formIsValid()) {
        return;
      }
      this.doingLogin = true;
      const { login, password } = this;
      LoginService.facade()
        .doLogin(login, password)
        .then(() => {
          this.doingLogin = false;
          this.$router.go();
          this.goToHome();
        })
        .catch(({ status, data }) => {
          this.doingLogin = false;
          this.login = '';
          this.password = '';
          if (status === 401) {
            this.$swal({
              type: 'error',
              title: 'Login e/ou senha inválidos!',
              text: data.message,
            });
          } else {
            this.$swal({
              type: 'error',
              title: 'Erro interno, contate o suporte!',
              text: data.message,
            });
          }
        });
    },
  },
};
</script>
