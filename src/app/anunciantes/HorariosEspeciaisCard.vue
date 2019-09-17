<template lang="pug">
  #horarios-atendimento-especiais(v-if="horariosEspeciais.length")
    .crud-title.py-4 Horários especiais
    v-card
      v-card-text
        v-layout(
          v-for="(horario, index) in horariosEspeciais"
          :key="index"
          wrap
          row
          )
          v-flex(xs4)
            .body-2.py-1.mr-5 Dia da semana: {{ getDiaSemana(horario) }}.
              |  Das: {{ getHoraInicio(horario) }} às {{ getHoraFinal(horario) }}
          v-layout.layout-time-picker(row wrap v-if="edit")
            v-flex(xs4)
              v-select(
                :items="itensDia"
                label="Dia da semana"
                v-model="horario.dia_semana"
                )
            input-time-picker(v-model="horario.inicio_hora" label="Horário inicial").mr-2
            input-time-picker(v-model="horario.fim_hora" label="Horário final")
</template>

<script>
import Moment from 'moment';
import InputTimePicker from '@/components/InputTimePicker.vue';

export default {
  name: 'anunciante-horarios-atendimentos',

  props: {
    value: {
      type: Object,
      default: () => { return { diaSemanaInicial: '', diaSemanaFinal: '' }; },
      required: true,
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    InputTimePicker,
  },

  computed: {
    horariosEspeciais() {
      const { horarios_atendimento: horarioAtendimento } = this.value;
      if (!horarioAtendimento) {
        return [];
      }

      const { horarios_especiais: horariosEspeciais } = horarioAtendimento;
      return horariosEspeciais || [];
    },
  },

  data: () => ({
    selecionado: null,
    itensDia: ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado', 'Feriado'],
  }),

  methods: {
    getDiaSemana(item) {
      return item.dia_semana || '';
    },
    getHoraInicio(item) {
      return this.formatHours(item.inicio);
    },
    getHoraFinal(item) {
      return this.formatHours(item.fim);
    },
    formatHours(hours) {
      if (!hours) {
        return '';
      }

      return Moment(hours).format('HH:mm');
    },
    getValues() {
      this.horario.selecionado = Moment(this.horarioSelecao, ['h:mm']).format();
    },
  },

  watch: {
    selecionado: {
      handler() {
        this.getValues();
      },
      deep: true,
    },
  },
};
</script>

<style lang="stylus">
#horarios-atendimento-especiais
  .layout-time-picker
    margin-top -1.2em
</style>
