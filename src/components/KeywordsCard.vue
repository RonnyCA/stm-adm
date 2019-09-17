<template lang="pug">
  #fotos-anunciante
    .crud-title.py-4 Palavras chave
    v-card
      v-container(grid-list-sm fluid)
        v-combobox(
          v-model="internalValue"
          label="Nenhuma palavra chave cadastrada"
          chips
          solo
          multiple
          :readonly="readOnly"
        )
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    readOnly: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    internalValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>

<style lang="stylus">
  .v-chip
    color #381F87 !important
    border-color #381F87 !important
    background 0 !important
</style>
