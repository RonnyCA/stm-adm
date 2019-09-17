<template lang="pug">
  #administradores-form-view
    .crud-title.mb-4 {{ title }}
    v-form(
      ref="form"
      v-model="valid"
      lazy-validation
      @submit="saveAdministrador()"
      )
      v-card.pb-2
        v-container
          v-layout(column)
            v-text-field(
              label="Nome completo"
              :rules="[rules.required]"
              v-model="administrador.nome_completo"
              :readonly="viewReadOnly"
              )
            v-text-field(
              label="E-mail"
              :rules="[rules.required, rules.emailRules]"
              v-model="administrador.usuario.email"
              :readonly="viewReadOnly"
              )
            v-text-field(
              v-if="viewAdministrator"
              label="Senha Antiga"
              :rules="[rules.senhaRequiredIf]"
              v-model="administrador.senha_antiga"
              :type="fieldSenha.password"
              )
            v-text-field(
              label="Senha"
              v-if="editOrNew"
              v-model="senha"
              :rules="[rules.senhaRequired]"
              :type="fieldSenha.type"
              :append-icon="fieldSenha.icon"
              @click:append="senhaToggle"
              )
            v-text-field(
              v-if="editOrNew"
              :type="fieldSenha.type"
              v-model="administrador.confirmacao_senha"
              label="Confirmação de senha"
              :rules="[rules.senhaRequiredIf, rules.validaSenha, rules.senhaRequired]"
              )
        v-card-actions.px-3(v-if="!viewReadOnly")
          v-spacer
          v-btn(
            flat
            @click.stop="goToListAdministrator()"
            :disabled="$loading.isLoading"
            ) Cancelar
          v-btn(
            outline
            type="submit"
            color="primary"
            :disabled="!valid || $loading.isLoading"
            ) Salvar
    users-modules-permissions(
      v-if="editOdersAdministrators"
      :modulos="modulos"
      )
</template>

<script>
import LoginService from '@/services/LoginService';
import AdministratorService from '@/services/AdministratorService';
import UsersModulesPermissions from './UsersModulesPermissions';

export default {
  name: 'AdministradorPerfil',

  components: {
    UsersModulesPermissions,
  },

  data: vm => ({
    valid: false,
    statusSenhaAntiga: false,
    administrador: {
      nome_completo: '',
      usuario: {
        email: '',
        tipo_usuario: 'Default',
        id: '',
        versao: 0,
      },
      confirmacao_senha: '',
      senha_antiga: '',
      versao: 0,
    },
    modulos: [],
    fieldSenha: {
      icon: 'visibility_off',
      type: 'password',
      password: 'password',
      value: false,
    },
    senha: '',
    confirmacao: {
      value: '',
    },
    rules: {
      required: v => !!v || 'Campo Obrigatório',
      emailRules: v => /^([0-9a-zA-Z]+([_.-]?[0-9a-zA-Z]+)*@[0-9a-zA-Z]+[0-9,a-z,A-Z,.,-]*(.){1}[a-zA-Z]{2,4})+$/.test(v) || 'E-mail inválido!',
      validaSenha: v => v === vm.senha || 'Senhas não conferem',
      senhaRequiredIf: (v) => {
        if (!!vm.senha && !v) {
          return 'Campo Obrigatório';
        }
        return true;
      },
      senhaRequired: v => vm.isEdit || vm.rules.required(v) || 'Campo Obrigatório',
    },
  }),

  beforeMount() {
    if (this.$route.path === '/meu-perfil') {
      this.loadUsuario(LoginService.getUserId());
    }

    if (this.$route.path === '/visualizar-perfil') {
      this.loadUsuario(LoginService.getUserId());
    }
  },

  computed: {
    viewAdministrator() {
      const { $route } = this;
      return $route.path === '/meu-perfil';
    },
    editOdersAdministrators() {
      const { $route } = this;
      return $route.path === `/administradores/${this.$route.params.administrador_id}`;
    },
    editOrNew() {
      const { $route } = this;
      return this.viewAdministrator || $route.path === '/administradores/cadastrar';
    },
    viewReadOnly() {
      const { $route } = this;
      return $route.path === '/visualizar-perfil';
    },
    isEdit() {
      return !!this
        .administrador
        .id;
    },
    title() {
      const adminId = this.$route.params.administrador_id || null;
      if (this.viewAdministrator) {
        this.loadUsuario(LoginService.getUserId());
        return 'Edição de administrador';
      }
      if (adminId) {
        this.loadUsuario(adminId);
        return 'Edição de administrador';
      }
      if (this.$route.path === '/visualizar-perfil') {
        return 'Visualização administrador';
      }
      return 'Novo administrador';
    },
  },
  notifications: {
    showSuccess: {
      title: 'Sucesso',
      message: 'Cadastro efetuado com sucesso!',
      type: 'success',
    },
    showError: {
      title: 'Erro',
      message: 'Ocorreu um erro ao gravar.',
      type: 'error',
    },
  },

  methods: {
    loadUsuario(id) {
      this.$loading.start();

      AdministratorService
        .facade()
        .find(id)
        .then(({ data }) => {
          this.$loading.finish();
          this.modulos = data.modulos;
          this.administrador = {
            nome_completo: data.nome_completo,
            usuario: {
              email: data.usuario.email,
              tipo_usuario: data.usuario.tipo_usuario,
              id: data.usuario.id,
              versao: data.usuario.versao,
            },
            confirmacao_senha: '',
            senha_antiga: '',
            versao: data.versao,
            id: data.id,
            moduloId: [],
          };
          const modulosUser = data
            .modulos
            .filter(modulo => modulo.selecionado === true)
          modulosUser.map(({ id }) => {
            this.administrador.moduloId.push(id);
          })
        })
        .catch(() => {
          this.showError({ message: 'Não foi possível obter os dados do administrador cadastrado' });
          this.$loading.finish();
        });
    },
    formIsValid() {
      return this
        .$refs
        .form
        .validate();
    },
    saveAdministrador() {
      if (!this.formIsValid()) {
        return false;
      }

      return this.isEdit
        ? this.saveEditUserAdmin()
        : this.saveNewAdmin();
    },
    saveEditUserAdmin() {
      const { administrador, senha } = this;
      administrador.usuario.senha = senha;
      this.$loading.start();

      return AdministratorService
        .facade()
        .edit(administrador.id, administrador)
        .then(() => {
          this.$loading.finish();
          this.showSuccess({ message: 'Edição efetuada com sucesso!' });
          this.goToListAdministrator();
        })
        .catch(({ data }) => {
          this.$loading.finish();
          data.erros.map(erro => this.showError({ message: erro }));
        });
    },
    saveNewAdmin() {
      const { administrador, senha } = this;
      administrador.usuario.senha = senha;
      
      this.$loading.start();

      return AdministratorService
        .facade()
        .add(administrador)
        .then(() => {
          this.$loading.finish();
          this.showSuccess({ message: 'Administrador cadastrado com sucesso!' });
          this.goToListAdministrator();
        })
        .catch(() => {
          this.$loading.finish();
          this.showError({ message: 'Email já cadastrado!' });
        });
    },
    goToList() {
      return this
        .$router
        .push('/meu-perfil');
    },
    goToHome() {
      return this
        .$router
        .push('/');
    },
    goToListAdministrator() {
      return this
        .$router
        .push('/administradores');
    },
    senhaToggle() {
      const { fieldSenha } = this;
      const { value } = fieldSenha;

      fieldSenha.value = !value;
      fieldSenha.icon = value ? 'visibility_off' : 'visibility';
      fieldSenha.type = value ? 'password' : 'text';
    },
  },
  watch: {
    modulos: {
      handler(value) {
        this.administrador.moduloId = [];
        const modulosUser = value.filter(modulo => modulo.selecionado === true)
        modulosUser.map(({ id }) => {
          this.administrador.moduloId.push(id);
        });
      },
      deep: true,
    }
  }
};
</script>
