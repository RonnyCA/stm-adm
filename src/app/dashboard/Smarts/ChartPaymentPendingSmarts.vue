<template lang="pug">
  #chartPayment
    chart(
      title="Quantidade pendente de pagamento de smarts por planos"
      :generateReportView="generateReportVerticalChart"
      :generateReport="possuiItems"
      :options="optionsVerticalChart"
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
              @click="menu = false"
              @input="filters.dateVerticalChart = monthFormattedBR(date)"
              )
</template>
<script>
import DashboardService from '@/services/DashboardService';
import Chart from '@/app/dashboard/Chart';
import DateFormatte from '@/mixins/date-formatte';
import moment from 'moment';
import PlanoService from '@/services/PlanosService';

export default {
  name: 'chart-payment-pending-smarts',

  components:{
    Chart,
  },

  mixins: [DateFormatte],

  data: () => ({
  menu: false,
  filters: {
    dateVerticalChart: moment().format('MM/YYYY'),
  },
  date: moment().format('YYYY-MM'),
  optionsVerticalChart: {},
  columnsVerticalChart: [],
  planos: [],
  dataPayments: [],
  }),

  computed: {
    possuiItems() {
      const { dataPayments } = this
      if (dataPayments.length) {
        return !!dataPayments.find((advertiser) => {
          return advertiser.planos.find((plan) => {
            return plan.quantidade > 0;
          });
        });
      }
      return false;
    },
  },

  notifications: {
    showError: {
      title: 'Deu ruim',
      message: 'Ocorreu um erro ao tentar pegar os dados do mockAPI!!',
      type: 'error',
    },
  },
  
  created() {
    this.getAllPlan();
  },

  methods: {
    getAllPlan() {
      this.$loading.start();

      PlanoService
        .facade()
        .getPlans()
        .then(( { data }) => {
          data.map((plano) => {
            this.planos.push(plano.titulo);
          })

          const { dateVerticalChart } = this.filters;
          const date = this.parseMonth(dateVerticalChart);
          this.getDashboardPaymentsVerticalChart(date);
        })
        .catch(() => {
          this.showError();
          this.$loading.finish();
        });
    },

    getDashboardPaymentsVerticalChart(data) {
      this.$loading.start();

      let params = { data };

      DashboardService
        .facade()
        .getPaymentPendingSmart(params)
        .then(({ data }) => {
          this.dataPayments = data;
          this.columnsVerticalChart = [];
          this.mountOptionsVerticalChart(this.dataPayments);
          this.$loading.finish();
        })
        .catch(() => {
          this.showError();
          this.$loading.finish();
        });
    },
    mountOptionsVerticalChart(payments) {
      let eixoY = [];
      let eixoX = [];
      this.planos.map((plano) => {
        eixoY[plano] = [plano];
        payments.map((payment) => {
          const existsPeriod = eixoX.find((eixo) => eixo === payment.semana);
          if(!existsPeriod) {
            eixoX.push(payment.semana);
          }

          const tipoPlano = payment.valor.find((planoAtual) => planoAtual.plano === plano);
          eixoY[plano].push(tipoPlano.quantidade);
        });
        this.columnsVerticalChart.push(eixoY[plano]);
      });

      this.optionsVerticalChart = {
        data: {
          columns: this.columnsVerticalChart,
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
      const { dateVerticalChart } = value;
      const date =  this.parseMonth(dateVerticalChart);
      this
        .$router
        .push({ name: 'report-payment-pending-by-plan', query: { data: date } });
    },
  },
  watch: {
    filters: {
      handler(value) {
        const { dateVerticalChart } = value;
        const date = this.parseMonth(dateVerticalChart);
        this.getDashboardPaymentsVerticalChart(date);
      },
      deep: true,
    },
  },
};
</script>

