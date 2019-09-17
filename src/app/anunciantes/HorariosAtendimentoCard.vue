<template lang="pug">
  #horarios-atendimento
    .crud-title.py-4 Horário de atendimento
    v-card
      v-layout(wrap)
        v-flex(xs2)
          v-card-text
            v-layout(row wrap)
              .body-2.py-1 De: {{ horariosAtendimento.dia_semana_inicial }}
                |  à {{ horariosAtendimento.dia_semana_final }}
            v-layout(row wrap)
              .body-2.py-1 Das: {{ horarioInicioSelecao }} às {{ horarioFimSelecao  }}
        v-flex(v-if="edit").ml-3
          v-layout(wrap)
            v-flex.mr-2(xs2)
              v-select(
                :items="itensDia"
                label="Dia da Semana Inicial"
                v-model="horariosAtendimento.dia_semana_inicial"
              )
            v-flex.mr-2(xs2)
              v-select(
              :items="itensDia"
              label="Dia da Semana Final"
              v-model="horariosAtendimento.dia_semana_final"
              )
            v-flex.mr-2(xs2)
              v-menu(
                ref="menuInicio"
                transition='scale-transition'
                offset-y
                :nudge-left='40'
                max-width='290px'
                :close-on-content-click='false'
                @input='inputInicio'
              )
                v-text-field(
                  slot='activator'
                  label='Horário Inicial'
                  v-model='horarioInicioSelecao'
                  prepend-icon='schedule'
                  readonly
                )
                v-time-picker(
                  ref='timepickerInicio'
                  v-model='horarioInicioSelecao'
                  no-title
                  scrollable
                  format='24hr'
                  @change="$refs.menuInicio.save(horarioInicioSelecao)"
                )
            v-flex.mr-2(xs2)
              v-menu(
                ref="menuFim"
                transition='scale-transition'
                offset-y
                :nudge-left='40'
                max-width='290px'
                :close-on-content-click='false'
                @input='inputFim'
              )
                v-text-field(
                  slot='activator'
                  label='Horario Final'
                  v-model='horarioFimSelecao'
                  prepend-icon='schedule'
                  readonly
                )
                v-time-picker(
                  ref='timepickerFim'
                  v-model='horarioFimSelecao'
                  no-title=''
                  scrollable=''
                  format='24hr'
                  @change="$refs.menuFim.save(horarioFimSelecao)"
                )
</template>
<script>
import Moment from 'moment';

export default {
  name: 'anunciante-horarios-atendimentos',
  props: {
    value: {
      type: Object,
      default: () => ({ dia_semana_inicial: '', dia_semana_final: '' }),
    },
    edit: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    itensDia: ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'],
    horarioInicioSelecao: null,
    horarioFimSelecao: null,
  }),
  watch: {
    horarioInicioSelecao: {
      deep: true,
      handler: 'getValues',
    },
    horarioFimSelecao: {
      deep: true,
      handler: 'getValues',
    },
  },
  computed: {
    horariosAtendimento: {
      get() {
        this.horarioInicioSelecao = this.value ? this.formatHours(this.value.inicio) : '00:00';
        this.horarioFimSelecao = this.value ? this.formatHours(this.value.fim) : '00:00';
        return this.value || { dia_semana_inicial: '', dia_semana_final: '' } ;
      },
      set() {
        return this.value || { dia_semana_inicial: '', dia_semana_final: '' };
      },
    },
  },
  methods: {
    inputInicio(val) {
      return !val && (this.$refs.timepickerInicio.selectingHour = true);
    },
    inputFim(val) {
      return !val && (this.$refs.timepickerFim.selectingHour = true);
    },
    formatHours(hours) {
      if (!hours) {
        return;
      }

      return Moment(hours).format('HH:mm');
    },
    getValues() {
      this.horariosAtendimento.inicio = Moment(this.horarioInicioSelecao, ['h:mm']).format();
      this.horariosAtendimento.fim = Moment(this.horarioFimSelecao, ['h:mm']).format();
    },
  },
};
</script>

