<template lang="pug">
  #chartOffer
    chart(
      title="Quantidade de ofertas ativas"
      :generateReport="possuiItems"
      :options="optionsLineChart"
      :showCardActions="false"
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
              v-model="filters.dateLineChart"
              @blur="date = parseMonth(filters.dateLineChart)"
              )
            v-date-picker(
              no-title
              scrollable
              type="month"
              locale="pt-br"
              v-model="date"
              color="primary"
              @click="menu = false"
              @input="filters.dateLineChart = monthFormattedBR(date)"
              )
</template>
<script>
import DashboardService from '@/services/DashboardService';
import DateFormatte from '@/mixins/date-formatte';
import Chart from '@/app/dashboard/Chart';
import moment from 'moment';

export default {
  name: 'chart-offer-active',

  components:{
    Chart,
  },

  mixins: [DateFormatte],
  
  notifications: {
    showError: {
      title: 'Não foi possível carregar os dados!',
      message: 'Ocorreu um erro ao tentar carregar os dados de quantidade de ofertas ativas!!',
      type: 'error',
    },
  },

  data: () => ({
  menu: false,
  filters: {
    dateLineChart: moment().format('MM/YYYY'),
  },
  date: moment().format('YYYY-MM'),
  optionsLineChart: {},
  columnsLineChart: [],
  dataOffers: [],
  }),

  computed: {
    possuiItems() {
      const { dataOffers } = this
      if(dataOffers.length) {
        return !!dataOffers.find((offer) => {
          return offer.quantidade > 0;
        });
      }
      return false;
    },
  },

  created() {
    const { dateLineChart } = this.filters
    const date = this.parseMonth(dateLineChart);
    this.getDashboardOffersLineChart(date);
  },

  methods: {
    getDashboardOffersLineChart(data) {
      this.$loading.start();

      let params = { data };

      DashboardService
        .facade()
        .getOffer(params)
        .then(({ data }) => {
          this.dataOffers = data;
          this.columnsLineChart = [];
          this.mountOptionsLineChart();
          this.$loading.finish();
        })
        .catch(() => {
          this.showError();
          this.$loading.finish();
        });
    },
    mountOptionsLineChart() {
      const { dataOffers } = this;
      let qtdOffers = ['Ofertas'];
      let eixoX = [];

      dataOffers.map((offer, index) => {
        qtdOffers.push(offer.quantidade);
        eixoX.push(offer.semana);
      });

      this.columnsLineChart.push(qtdOffers);
      this.optionsLineChart = {
        data: {
          columns: this.columnsLineChart,
        },
        axis: {
          x: {
            type: 'category',
            categories: eixoX,
          },
        },
      };
    },
    generateReportLineChart() {
      //fazer 
    },
  },
  watch: {
    filters: {
      handler(value) {
        const { dateLineChart } = value;
        const date = this.parseMonth(dateLineChart);
        this.getDashboardOffersLineChart(date);
      },
      deep: true,
    },
  },
};
</script>

