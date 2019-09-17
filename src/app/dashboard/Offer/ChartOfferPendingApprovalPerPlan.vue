<template lang="pug">
  #chartOffer
    chart(
      title="Quantidade de ofertas pendentes de aprovação por plano"
      :generateReportView="generateReportHorizontalChart"
      :generateReport="possuiItems"
      :options="optionsHorizontalChart"
      )
</template>
<script>
import DashboardService from '@/services/DashboardService';
import Chart from '@/app/dashboard/Chart';

export default {
  name: 'chart-offer-pending-approval-per-plan',

  components: {
    Chart,
  },

  notifications: {
    showError: {
      title: 'Não foi possível carregar os dados!',
      message: 'Ocorreu um erro ao tentar carregar os dados de quantidade de ofertas pendentes de aprovação por plano!!',
      type: 'error',
    },
  },

  data: () => ({
    optionsHorizontalChart: {},
    columnsHorizontalChart: [],
    dataOffer: [],
  }),

  computed: {
    // fazer método de validação do botão
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
    this.getOfferHorizontalChart();
  },

  methods: {
    generateReportHorizontalChart() {
      this
        .$router
        .push({ name: 'report-offer-pending-approval-per-plan'});
    },
    getOfferHorizontalChart() {
      this.$loading.start();

      DashboardService
        .facade()
        .getOfferByPlan()
        .then(({ data }) => {
          this.dataOffer = data;
          this.columnsHorizontalChart = [];
          this.mountOptionsHorizontalChart(this.dataOffer);
          this.$loading.finish();
        })
        .catch(() => {          
          this.showError();
          this.$loading.finish();
        });
    },
    mountOptionsHorizontalChart() {
      const { dataOffer } = this;
      let pendentes = [];
      let eixoX = ['Ofertas pendentes'];

      dataOffer.map((offerPendent,index) => {
        
        pendentes.push(offerPendent.plano);
        eixoX.push(offerPendent.quantidade);
      });
      this.columnsHorizontalChart.push(eixoX);
      this.optionsHorizontalChart = {
        data: {
          columns: this.columnsHorizontalChart,
          type: 'bar',
        },
        axis: {
          rotated: true,
          x: {
            type: 'category',
            categories: pendentes,
          },
        },
      };
    },
  },
}
</script>

