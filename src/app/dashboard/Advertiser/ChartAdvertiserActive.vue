<template lang="pug">
  #chartAdvertiser
    chart(
      title="Anunciantes ativos"
      :generateReportView="generateReportVerticalChart"
      :generateReport="possuiItems"
      :options="optionsVerticalCharts"
      )
      v-layout(row wrap slot="filters")
        v-flex.mt-3(md3 xs12)
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
              v-model="filters.dateVerticalChart"
              @blur="date = parseMonth(filters.dateVerticalChart)"
              )
            v-date-picker(
              no-title
              scrollable
              type="month"
              locale="pt-br"
              v-model="date"
              color="primary"
              @click="menu1 = false"
              @input="filters.dateVerticalChart = monthFormattedBR(date)"
              )
</template>

<script>
import DashboardService from '@/services/DashboardService';
import DateFormatte from '@/mixins/date-formatte'
import Chart from '@/app/dashboard/Chart';
import moment from 'moment';

export default {
  name: 'chart-advertiser',

  mixins: [DateFormatte],

  components: {
    Chart,
  },

  data: () => ({
    valid: false,
    filters: {
      dateVerticalChart: moment().format('MM/YYYY'),
    },
    date: moment().format('YYYY-MM'),
    optionsVerticalCharts: {},
    columnsVerticalCharts: [],
    menu: false,
    dataAdvertiser: [],
  }),
  created() {
    const { dateVerticalChart } = this.filters
    const date = this.parseMonth(dateVerticalChart);
    this.getDashboardAdvertiser(date);
  },
  computed: {
    possuiItems() {
      const { dataAdvertiser } = this
      if (dataAdvertiser.length) {
        return !!dataAdvertiser.find((advertiser) => {
          return (advertiser.smart > 0 || advertiser.premium > 0);
        });
      }
      return false;
    }
  },

  notifications: {
    showError: {
      title: 'Erro',
      message: 'Ocorreu um erro ao tentar pegar construir o gráfico de anunciantes ativos!!',
      type: 'error',
    },
  },

  methods: {
    getDashboardAdvertiser(data) {
      this.$loading.start();

      const params = {
        data,
      };

      DashboardService
        .facade()
        .getAdvertiserActive(params)
        .then(({ data }) => {
          this.dataAdvertiser = data;
          this.columnsVerticalCharts = [];
          this.mountOptionsVerticalChart(this.dataAdvertiser);
          this.$loading.finish();
        })
        .catch(() => {
          this.showError();
          this.$loading.finish();
        });
    },
    mountOptionsVerticalChart(advertiser) {
      let smarts = ['Smarts'];
      let premium = ['Premium'];
      let eixoX = [];
      advertiser.map((advertiser, index) => {
        smarts.push(advertiser.smart);
        premium.push(advertiser.premium);
        eixoX.push(advertiser.semana);
      });
      this.columnsVerticalCharts.push(smarts, premium);

      this.optionsVerticalCharts = {
        data: {
          columns: this.columnsVerticalCharts,
          type: 'bar',
        },
        axis: {
          x: {
            type: 'category',
            categories: eixoX,
          },
        },
      };
    },
    generateReportVerticalChart() {
      const { dateVerticalChart } = this.filters
      const date = this.parseMonth(dateVerticalChart);
      this
        .$router
        .push({ name: 'report-advertiser-active', query: { data: date } });
    },
  },
  watch: {
    filters: {
      handler(value) {
        const { dateVerticalChart } = value;
        const date = this.parseMonth(dateVerticalChart)
        this.getDashboardAdvertiser(date);
      },
      deep: true,
    },
  },
};
</script>
