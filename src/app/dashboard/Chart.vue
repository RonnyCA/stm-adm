<template lang="pug">
  #chart
    v-card.my-3
      v-card-title {{ title }}
      v-card-text
        v-container(grid-list-md align-center justify-center)
          v-layout(row wrap)
            v-flex(md12 xs12)
              vue-c3(
                :handler="handler"
              )
            slot(name="filters")
      v-card-actions(v-if="showCardActions")
        v-spacer
        v-btn(
          :disabled="!generateReport"
          flat
          outline
          color="primary"
          @click="generateReportView()"
          )
          | Gerar Relatorio
</template>

<script>
import VueC3 from 'vue-c3';
import Vue from 'vue';

export default {
  props: {
    title: {
      type: String,
      default: 'Gráfico',
    },
    handler: {
      type: Object,
      default: () => new Vue(),
    },
    generateReportView: {
      type: Function,
      required: false,
    },
    generateReport: {
      type: Boolean,
      default: true,
    },
    options: {
      type: Object,
      required: false,
    },
    showCardActions: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    VueC3,
  },
  watch: {
    options: {
      handler(value) {
        this.handler.$emit('init', value);
      },
      deep: true,
    },
  },
};
</script>
