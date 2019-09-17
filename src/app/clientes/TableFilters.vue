<template lang="pug">
  #filters.px-4
    v-layout(row wrap)
      v-flex.px-1(
        md3
        xs12
        )
        v-autocomplete(
          clearable
          :items="tipoUsuario"
          label="Tipo de usuário"
          v-model="internalModelUsuario"
          )
      v-flex.px-1(
        md3
        xs12
        )
        v-autocomplete(
          clearable
          :items="status"
          label="Status do usuário"
          v-model="internalModelStatus"
          )
      v-flex.px-1(
        md3
        xs12
        )
        v-autocomplete(
          clearable
          :items="formaPagamento"
          label="Forma de pagamento"
          v-model="internalModelFormaPagamento"
          )
      v-flex.px-1(
        md3
        xs12
        )
        v-autocomplete(
          clearable
          :items="statusPagamento"
          label="Status do pagamento"
          v-model="internalModelStatusPagamento"
          )
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true,
    },
    tipoUsuario: {
      type: Array,
    },
    status: {
      type: Array,
    },
    formaPagamento: {
      type: Array,
    },
    statusPagamento: {
      type: Array,
    },
  },

  computed: {
    internalModelUsuario: {
      get() {
        return this.value.tiposUsuario;
      },
      set(newValue) {
        this.$emit('set-filter-user', newValue);
      },
    },
    internalModelStatus: {
      get() {
        return this.value.status;
      },
      set(newValue) {
        this.$emit('set-filter-status', newValue);
      },
    },
    internalModelFormaPagamento: {
      get() {
        return this.value.formaPagamento;
      },
      set(newValue) {
        this.$emit('set-filter-type-payment', newValue);
      },
    },
    internalModelStatusPagamento: {
      get() {
        return this.value.statusPagamento;
      },
      set(newValue) {
        this.$emit('set-filter-status-payment', newValue);
      },
    },
  },
};
</script>

