<template lang="pug">
  #usersModulesPermissions
    .crud-title.my-4 Módulos
    v-card
      v-card-text
        .subheading Selecione os módulos que o usuário terá permissão para acessar
        v-layout(row wrap grid-list-md)
          v-flex(
            md3
            xs12
            )
            v-checkbox(
              label="Selecionar Todos"
              v-model="selectAll"
              )
          v-flex(
            md3
            xs12
            v-for="(modulo, key) in modulos"
            :key="key"
            )
            v-checkbox(
              :label="modulo.nome"
              v-model="modulo.selecionado"
              )
</template>

<script>

export default {
  name: 'users-modules-permissions',

  props: {
    modulos: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    selectAll: false,
  }),

  watch: {
    selectAll: {
      handler(value) {
        this.modulos.map((modulo) => {
          modulo.selecionado = value;
        });
      },
    },
  },
};
</script>
