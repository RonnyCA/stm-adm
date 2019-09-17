<template lang="pug">
  #chartOffer
    chart(
      title="Quantidade de reservas pendentes de aprovação pelo anunciante por plano"
      :generateReportView="generateReportDonutChart"
      :generateReport="possuiItems"
      :options="optionsDonutChart"
      )
</template>
<script>
import DashboardService from '@/services/DashboardService';
import Chart from '@/app/dashboard/Chart';

export default {
  name: 'chart-offer-pending-approval-by-advertiser-per-plan',
  
  components: {
    Chart,
  },

  notifications: {
    showError: {
      title: 'Não foi possível carregar os dados!',
      message: 'Ocorreu um erro ao tentar carregar os dados de quantidade de reservas pendentes de aprovação pelo anunciante por plano!!',
      type: 'error',
    },
  },

  data: () => ({
    optionsDonutChart: {},
    columnsDonutChart: [],
    dataOffer: [],
  }),

  computed: {
    possuiItems() {
      const { dataOffer } = this
      if(dataOffer.length) {
        return !!dataOffer.find((offer) => {
          return offer.quantidade > 0;
        });
      }
      return false;
    },
  },

  created() {
    this.getOfferDonutChart();
  },

  methods: {
    generateReportDonutChart() {
      this
        .$router
        .push({ name: 'report-reservations-pending-approval-per-plan' });
    },
    getOfferDonutChart() {
      this.$loading.start();

      DashboardService
        .facade()
        .getOfferAdvertiserByPlan()
        .then(({ data }) => {
          this.dataOffer = data;
          this.columnsDonutChart = [];
          this.mountOptionsDonutChart(this.dataOffer);
          this.$loading.finish();
        })
        .catch(() => {
          this.showError();
          this.$loading.finish();
        });
    },
    mountOptionsDonutChart() {
      const { dataOffer } = this;
      dataOffer.map((advertiserPendent, index) => {
        let quantidadeReservas = [];
        quantidadeReservas.push(advertiserPendent.plano);
        quantidadeReservas.push(advertiserPendent.quantidade);
        this.columnsDonutChart.push(quantidadeReservas);
      });
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
}
</script>

