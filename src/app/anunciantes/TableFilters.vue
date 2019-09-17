<template lang="pug">
  #filters.px-4
    v-layout(row wrap)
      v-flex.px-1(
        md4
        xs12
        )
        v-autocomplete(
          :items="tipoUsuario"
          label="Tipo de usuário"
          v-model="internalModelUsuario"
          )
      v-flex.px-1(
        md4
        xs12
        )
        v-autocomplete(
          :items="tipoCadastro"
          label="Tipo de cadastro"
          v-model="internalModelCadastro"
          )
      v-flex.px-1(
        md4
        xs12
        )
        v-autocomplete(
          label="Status cadastro"
          :items="statusCadastro"
          v-model="internalModelStatusCadastro"
          )
      v-flex.px-1(
        md4
        xs12
        )
        v-autocomplete(
          clearable
          label="Plano"
          :items="plano"
          v-model="internalModelPlano"
          )
      v-flex.px-1(
        md4
        xs12
        )
        v-autocomplete(
          clearable
          label="Forma de pagamento"
          :items="formaPagamento"
          v-model="internalModelFormaPagamento"
          )
      v-flex.px-1(
        md4
        xs12
        )
        v-autocomplete(
          clearable
          label="Status do pagamento"
          :items="statusPagamento"
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
    tipoCadastro: {
      type: Array,
    },
    statusCadastro: {
      type: Array,
    },
    plano: {
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
        return this.value.tipoUsuario;
      },
      set(newValue) {
        this.value.tipoUsuario = newValue;
        this.emitirEventoSetFilter();
      },
    },
    internalModelCadastro: {
      get() {
        return this.value.tipoCadastro;
      },
      set(newValue) {
        this.value.tipoCadastro = newValue;
        this.emitirEventoSetFilter();
      },
    },
    internalModelStatusCadastro: {
      get() {
        return this.value.statusCadastro;
      },
      set(newValue) {
        this.value.statusCadastro = newValue;
        this.emitirEventoSetFilter();
      },
    },
    internalModelPlano: {
      get() {
        return this.value.idPlano;
      },
      set(newValue) {
        this.value.idPlano = newValue;
        this.emitirEventoSetFilter();
      },
    },
    internalModelFormaPagamento: {
      get() {
        return this.value.formaDePagamento;
      },
      set(newValue) {
        this.value.formaDePagamento = newValue;
        this.emitirEventoSetFilter();
      },
    },
    internalModelStatusPagamento: {
      get() {
        return this.value.statusPagamento;
      },
      set(newValue) {
        this.value.statusPagamento = newValue;
        this.emitirEventoSetFilter();
      },
    },
  },
  methods: {
    emitirEventoSetFilter() {
      this.$emit('set-filter', this.value);
    },
  },
};
</script>
