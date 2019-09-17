<template lang="pug">
  #chartAdvertiserIrregularPayment
    chart(
      title="Quantidade de anunciantes com pagamento irregular"
      :generateReportView="generateReportPaymentIrregular"
      :generateReport="possuiItems"
      :options="optionsChartZoom"
      )
      v-layout(row wrap slot="filters")
        v-flex(md3 xs12)
          v-select(
            :items="categorias"
            v-model="filters.categoriasZoomChart"
            label="Categorias"
            )
        v-flex(md3 xs12)
          v-select(
            :items="planos"
            v-model="filters.planosZoomChart"
            label="Planos"
            )
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
              v-model="filters.dateChartZoom"
              @blur="date = parseMonth(filters.dateChartZoom)"
              )
            v-date-picker(
              no-title
              scrollable
              type="month"
              locale="pt-br"
              v-model="date"
              color="primary"
              @click="menu = false"
              @input="filters.dateChartZoom = monthFormattedBR(date)"
              )
</template>
<script>
import DashboardService from '@/services/DashboardService';
import DateFormatte from '@/mixins/date-formatte';
import Chart from '@/app/dashboard/Chart';
import moment from 'moment';
import PlanoService from '@/services/PlanosService';

export default {
  name: 'chart-advertiser-irregular-payment',

  mixins: [DateFormatte],

  components: {
    Chart,
  },

  props: {
    planos: {
      type: Array,
      required: true,
    },
    categorias: {
      type: Array,
      required: true,
    },
  },

  notifications: {
    showError: {
      title: 'Erro',
      message: 'Ocorreu um erro ao tentar pegar construir o gráfico de anunciantes irregulares!!',
      type: 'error',
    },
  },

  data: () => ({
    menu: false,
    filters: {
      dateChartZoom: moment().format('MM/YYYY'),
      planosZoomChart: '',
      categoriasZoomChart: '',
    },
    date: moment().format('YYYY-MM'),
    optionsChartZoom: {},
    columnsChartZoom: [],
    dataAdvertiser: [],
  }),
  
  computed: {
    possuiItems() {
      const { dataAdvertiser } = this
      if( dataAdvertiser.length) {
        return !!dataAdvertiser.find((advertiser) => {
          return advertiser.anunciantes_comuns_cadastrados > 0 || advertiser.anunciantes_premiuns_cadastrados;
        });
      }
      return false;
    },
  },
  created() {
    const { dateChartZoom, planosZoomChart, categoriasZoomChart } = this.filters
    const date = this.parseMonth(dateChartZoom);
    this.getAdvertiserChartZoom(date, planosZoomChart, categoriasZoomChart);
  },

  methods: {
    getAdvertiserChartZoom(data, plano, categoria) {
      this.$loading.start();

      const params = {
        data,
        planoId: plano,
        categoriaId: categoria,
      };

      DashboardService
        .facade()
        .getAdvertiser(params)
        .then(({ data }) => {
          this.dataAdvertiser = data;
          this.columnsChartZoom = [];
          this.mountOptionsChartZoom();
          this.$loading.finish();
        })
        .catch(() => {
          this.showError();
          this.$loading.finish();
        });
    },
    mountOptionsChartZoom() {
      const { dataAdvertiser } = this;
      let smart = ['Smart'];
      let smartPremium = ['SmartPremium'];
      let eixoX = [];

      dataAdvertiser.map((advertiser, index) => {
        smart.push(advertiser.anunciantes_comuns_cadastrados);
        smartPremium.push(advertiser.anunciantes_premiuns_cadastrados);
        eixoX.push(advertiser.semana);
      });
      this.columnsChartZoom.push(smart, smartPremium);
      this.optionsChartZoom = {
        data: {
          columns: this.columnsChartZoom,
        },
        axis: {
          x: {
            type: 'category',
            categories: eixoX,
          },
        },
        zoom: {
          enabled: true,
        },
      };
    },
    generateReportPaymentIrregular() {
      const { dateChartZoom, planosZoomChart, categoriasZoomChart } = this.filters
      const data = this.parseMonth(dateChartZoom);
      const queryString = { 
        data, 
        plano: planosZoomChart,
        categoria: categoriasZoomChart,
        };

      this
        .$router
        .push({ name: 'report-advertiser-irregular-payment', query: queryString });
    },
  },
  watch: {
    filters: {
      handler(value) {
        const { dateChartZoom, planosZoomChart, categoriasZoomChart } = value;
        const date = this.parseMonth(dateChartZoom);
        this.getAdvertiserChartZoom(date, planosZoomChart, categoriasZoomChart);
      },
      deep: true,
    },
  },
};
</script>

