<template lang="pug">
  #filter
    v-layout(row wrap)
      v-flex.pr-2(
        md4 
        xs12
        v-if="isTypeAdvertiser"          
        )
        v-autocomplete(
          label="Tipo de Usuário"
          v-model="internalModel"
          :items="tipoAnunciante"
          )
      v-flex.pr-2(
        md4 x
        s12
        v-if="isPlan"
        )
        v-autocomplete(
          label="Planos"
          v-model="internalModelPlano"
          :items="planos"
          )
      v-flex.pr-2(
        md4 x
        s12
        v-if="isCategory"
        )
        v-autocomplete(
          label="Categorias"
          v-model="internalModelCategoria"
          :items="categorias"
          )
      v-flex.pr-2(
        md4 x
        s12
        v-if="isStatusSaque"
        )
        v-autocomplete(
          label="Status saque"
          v-model="internalModelSaque"
          :items="statusSaque"
          )
</template>

<script>
import RadioGroupFilter from '@/components/RadioGroupFilter';
import PlanoService from '@/services/PlanosService';

export default {
  props: {
    value: {
      type: Object,
      required: true,
    },
    planos: {
      type: Array,
    },
    tipoAnunciante: {
      type: Array,
    },
    statusSaque: {
      type: Array,
    },
    categorias: {
      type: Array,
    },
  },

  components: {
    RadioGroupFilter,
  },

  computed: {
    internalModel: {
      get() {
        return this.value.tipoAnunciante;
      },
      set(newValue) {
        this.$emit('set-filter', newValue);
      },
    },
    internalModelPlano: {
      get() {
        return this.value.plano;
      },
      set(newValue) {
        this.$emit('set-filter-plan', newValue);
      },
    },
    internalModelCategoria: {
      get() {
        return this.value.categoria;
      },
      set(newValue) {
        this.$emit('set-filter-category', newValue);
      },
    },
    internalModelSaque: {
      get() {
        return this.value.statusSaque;
      },
      set(newValue) {
        this.$emit('set-filter-status-saque', newValue);
      },
    },
    isStatusSaque() {
      return !!this.statusSaque;
    },
    isPlan() {
      return !!this.planos;
    },
    isCategory() {
      return !!this.categorias;
    },
    isTypeAdvertiser() {
      return !!this.tipoAnunciante;
    },
  },
};
</script>
