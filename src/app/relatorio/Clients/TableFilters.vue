<template lang="pug">
  #tableFiltersClients
    v-layout(row wrap)
      v-flex(xs4)
        v-autocomplete(
          :items="tiposUsuarios"
          v-model="tipoUsuario"
          label="Tipo de usuário"
          )
</template>

<script>
export default {
  name: 'table-filters-clientes',
  props: {
    filters: {
      type: Object,
    },
    tiposUsuarios: {
      type: Array,
    },
  },
  computed: {
    tipoUsuario: {
      get() {
        return this.filters.tipoUsuario;
      },
      set(value) {
        this.$emit('set-filter-tipo-usuario', value);
      },
    },
  },
};
</script>

<style lang="css">
</style>
