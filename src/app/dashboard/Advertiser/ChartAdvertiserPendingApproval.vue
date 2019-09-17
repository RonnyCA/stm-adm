<template lang="pug">
  #chartAdvertiser
     chart(
      title="Anunciantes pendentes de aprovação"
      :generateReportView="generateReportDonutChart"
      :generateReport="possuiItems"
      :options="optionsDonutChart"
      )
</template>

<script>
import DashboardService from '@/services/DashboardService';
import Chart from '@/app/dashboard/Chart';

export default {
  name: 'chart-advertiser-pending-approval',

  components: {
    Chart,
  },

  notifications: {
    showError: {
      title: 'Erro',
      message: 'Ocorreu um erro ao tentar pegar construir o gráfico de anunciantes pendentes de aprovação!!',
      type: 'error',
    },
  },

  data: () => ({
    optionsDonutChart: {},
    columnsDonutChart: [],
    dataAdvertiser: {},
  }),

  computed: {
    possuiItems() {
      const { dataAdvertiser } = this
      const { anunciantes_smart, anunciantes_smart_premium } = dataAdvertiser
      if (dataAdvertiser) {
        return !!(anunciantes_smart > 0 || anunciantes_smart_premium > 0);
      }
      return false;
    },
  },

  created() {
    this.getAdvertiserDonutChart();
  },

  methods: {
    generateReportDonutChart() { 
      this
        .$router
        .push({ name: 'report-advertiser-pending-approval' });
    },
    getAdvertiserDonutChart() {
      this.$loading.start();

      DashboardService
        .facade()
        .getAdvertiserType()
        .then(({ data }) => {
          this.dataAdvertiser = data;
          this.columnsDonutChart = [];
          this.mountOptionsDonutChart(this.dataAdvertiser);
          this.$loading.finish();
        })
        .catch(() => {
          this.showError();
          this.$loading.finish();
        });
    },
    mountOptionsDonutChart(advertiser) {
      let quantidadeAnuncianteSmart = ['Smart'];
      let quantidadeAnuncianteSmartPremium = ['Premium'];
      quantidadeAnuncianteSmart.push(advertiser.anunciantes_smart);
      quantidadeAnuncianteSmartPremium.push(advertiser.anunciantes_smart_premium);
      this.columnsDonutChart.push(quantidadeAnuncianteSmart, quantidadeAnuncianteSmartPremium);

      this.optionsDonutChart = {
        data: {
          columns: this.columnsDonutChart,
          type: 'donut',
        },
        donut: {
          label: {
            format(value) {
              return value
            },
          },
        },
      };
    },
  },
  watch: {

  },
};
</script>

