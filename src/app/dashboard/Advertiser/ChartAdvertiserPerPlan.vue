<template lang="pug">
  #chartAdvertiserPerPlan
    chart(
      title="Anunciante ativos por planos"
      :generateReportView="generateReportHorizontalChart"
      :generateReport="possuiItems"
      :options="optionsHorizontalChart"
      )
      v-layout(row wrap slot="filters")
        v-flex(md3 xs12)
          v-menu(
            lazy
            offset-y
            ref="menu"
            full-width
            v-model="menu"
            max-width="290px"
            min-width="290px"
            transition="scale-transition"
            )
            v-text-field(
              readonly
              label="Mês"
              slot="activator"
              prepend-icon="event"
              v-model="filters.dateHorizontalChart"
              @blur="date = parseMonth(filters.dateHorizontalChart)"
              )
            v-date-picker(
              no-title
              scrollable
              type="month"
              locale="pt-br"
              v-model="date"
              color="primary"
              @click="menu = false"
              @input="filters.dateHorizontalChart = monthFormattedBR(date)"
              )
</template>
<script>
import DashboardService from '@/services/DashboardService';
import Chart from '@/app/dashboard/Chart';
import moment from 'moment';
import DateFormatte from '@/mixins/date-formatte';
import PlanoService from '@/services/PlanosService';

export default {
  name: 'chart-advertiser-per-plan',

  mixins: [DateFormatte],

  components: {
    Chart,
  },

  props: {
    planos: {
      type: Array,
      required: true,
    },
  },

  notifications: {
    showError: {
      title: 'Erro',
      message: 'Ocorreu um erro ao tentar pegar construir o gráfico de anunciantes ativos por planos!!',
      type: 'error',
    },
  },


  data: () => ({
    valid: false,
    filters: {
      dateHorizontalChart: moment().format('MM/YYYY'),
      planosHorizontalChart: '',
    },
    date: moment().format('YYYY-MM'),
    optionsHorizontalChart: {},
    columnsHorizontalCharts: [],
    menu: false,
    dataAdvertiser: [],
  }),

  created() {
    const { dateHorizontalChart } = this.filters
    const date = this.parseMonth(dateHorizontalChart);
    this.getDashboardAdvertiserHorizontalChart(date);
  },

  computed: {
    possuiItems() {
      const { dataAdvertiser } = this
      if (dataAdvertiser.length) {
        return !!dataAdvertiser.find((advertiser) => {
          return advertiser.planos_info.find((plan) => {

            return plan.quantidade_anunciante > 0;
          });
        });
      }
      return false;
    },
  },

  methods: {
    getDashboardAdvertiserHorizontalChart(data) {
      this.$loading.start();

      const params = {
        data,
      };

      DashboardService
        .facade()
        .getAdvertiserReportPerPlan(params)
        .then(({ data }) => {
          this.dataAdvertiser = data;
          this.columnsHorizontalCharts = [];
          this.mountOptionsHorizontalChart(this.dataAdvertiser);
          this.$loading.finish();
        })
        .catch(() => {
          this.showError();
          this.$loading.finish();
        });
    },
    mountOptionsHorizontalChart(advertisers) {
      let eixoY = [];
      let eixoX = [];

      this.planos.map((plano) => {

        eixoX[plano] = [plano.text];
        advertisers.map((advertiser) => {
          const periodo = eixoY.find((eixo) => eixo === advertiser.semana);

          if (!periodo) {
            eixoY.push(advertiser.semana);
          }

          const tipoPlano = advertiser.planos_info.find((planoAtual) => planoAtual.plano_id === plano.value);

          eixoX[plano].push(tipoPlano.quantidade_anunciante);
        });
        this.columnsHorizontalCharts.push(eixoX[plano]);
      });


      this.optionsHorizontalChart = {
        data: {
          columns: this.columnsHorizontalCharts,
          type: 'bar',
        },
        axis: {
          rotated: true,
          x: {
            type: 'category',
            categories: eixoY,
          },
        },
      };
    },
    generateReportHorizontalChart() {
      const { dateHorizontalChart } = this.filters;
      const date = this.parseMonth(dateHorizontalChart);
      this
        .$router
        .push({ name: 'report-advertiser-registered-per-plan', query: { data: date } })
    },
  },
  watch: {
    filters: {
      handler(value) {
        const { dateHorizontalChart } = value;
        const date = this.parseMonth(dateHorizontalChart);
        this.getDashboardAdvertiserHorizontalChart(date);
      },
      deep: true,
    },
  },
};
</script>
